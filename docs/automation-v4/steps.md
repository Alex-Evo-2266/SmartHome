# Система шагов

## Связанные разделы

[README](./README.md) · [Схема](./schema.md) · [Действия](./step-action.md) · [Ожидание](./step-await.md) · [Условия](./conditions.md) · [Expressions](./expressions.md) · [Контекст](./execution-context.md)

## Граф шагов

`steps` — словарь, ключи которого являются ID узлов. `entry` задаёт начало. Шаги не исполняются по порядку YAML/JSON-словаря: runner выбирает следующий ID по результату обработчика.

| `type` | Модель | Фактическое назначение |
|---|---|---|
| `delay` | `DelayStep` | Разрешить `duration`, поставить отложенное продолжение. |
| `action` | `ActionStep` | Разрешить параметры и вызвать обработчик `command`. |
| `condition` | `ConditionStep` | Вычислить условное значение и перейти по одной из веток. |
| `await` | `AwaitStep` | Зарегистрировать событие ожидания/таймаут и приостановить текущий проход; реализация неполная. |
| `script` | `ScriptActionStep` | В схеме описан вызов другого сценария, но runner этот тип не исполняет. |

`RoomActionStep` встречается только как закомментированный код схемного модуля; он не входит в `Step` и не является поддерживаемым типом.

## Общие поля переходов

`label` — необязательная строка метки UI. `next` — необязательная строка ID следующего шага. У `ConditionStep` есть `on_true` и `on_false`; у `AwaitStep` — `on_timeout`. Pydantic проверяет, что заданные переходы указывают на ключи в `steps`.

Условный переход, задержка и ожидание имеют собственные правила: см. [conditions.md](./conditions.md), [step-await.md](./step-await.md). `ConditionStep` возвращает именно `on_true` или `on_false`; его `next` не используется как fallback. Не следует считать его автоматически используемым для слияния веток.

## Цикл исполнения

`AutomationRunner` начинает с `entry` либо с переданного start step. В цикле:

1. очищает кэши `AutomationContext`;
2. получает текущий шаг и направляет его в типизированный обработчик;
3. обработчик выполняет работу и возвращает ID следующего шага либо `None`;
4. `None` завершает данный проход (в том числе для приостановленных delay/await);
5. счётчик ограничивает один проход максимумом `MAX_STEPS_PER_RUN = 1000`.

`ExpressionError` преобразуется в ошибку исполнения шага. Подробности — [execution-context.md](./execution-context.md) и [error-handling.md](./error-handling.md).

## Типы шагов

### `delay`

Поля: `type: "delay"`, обязательный `duration: ExpressionArg`, необязательные `label`, `next`. Runner разрешает длительность, преобразует в секунды и планирует продолжение через APScheduler. Сам текущий проход завершается. См. [step-await.md](./step-await.md) для отличия от ожидания условия.

### `action`

Поля: `type: "action"`, обязательный `command: string`, `params: dict[str, ExpressionArg]` (по умолчанию `{}`), необязательные `label`, `next`. Подробности — [step-action.md](./step-action.md).

### `condition`

Поля: `type: "condition"`, обязательный `condition: ExpressionArg`, необязательные `on_true`, `on_false`, `label`, `next`. Runner вычисляет аргумент, преобразует результат в bool и возвращает переход по результату. См. [conditions.md](./conditions.md).

### `await`

Поля: `type: "await"`, обязательный `trigger: Trigger`, необязательные `timeout: ExpressionArg`, `on_timeout`, `label`, `next`. Фактическая реализация приостанавливает runner после регистрации подписки и таймаута; условие ожидания не фильтруется callback-ом manager. См. [step-await.md](./step-await.md).

### `script`

Поля схемы: `type: "script"`, `script: string`, `params: dict[str, ExpressionArg]` (по умолчанию `{}`), необязательные `label`, `next`. **Ограничение:** `ScriptActionStep` отсутствует в dispatch `AutomationRunner._execute_step`; запуск другого сценария не реализован runner-ом.

## Передача данных и ошибки

Между шагами передаётся прежде всего позиция в графе (ID next-step), а не результат предыдущего шага как автоматическая переменная. Значения вычисляются через `AutomationContext`, доступ к устройствам/комнатам выполняется через `ExpressionArg` и `resolve_path`. Ошибка вычисления/команды прерывает выполнение и поднимается как `StepExecutionError`; точное преобразование HTTP-ошибок описано в [error-handling.md](./error-handling.md).

## Known Issues

- `ScriptActionStep` и закомментированный `RoomActionStep` не исполняются и не входят в поддерживаемый runtime union соответственно.
- `ConditionStep.next` присутствует в схеме, но runner выбирает только `on_true` или `on_false`.
