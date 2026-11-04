# Структура автоматизации

## Связанные разделы

[README](./README.md) · [Триггеры](./triggers.md) · [Шаги](./steps.md) · [Выражения](./expressions.md) · [Аргументы](./expression-arguments.md) · [Валидация](./validation.md)

## Корневая модель `AutomationSchema`

Модель объявлена в `SmartHome/app/schemas/automation/automation_v4.py`. Для неё задано `extra="forbid"`: неизвестные поля не принимаются. Типы триггеров и шагов выбираются по дискриминирующим полям `type` (у временного триггера дополнительно `kind`).

| Поле | Тип | Обязательное | Значение по умолчанию | Назначение |
|---|---|---:|---|---|
| `schema_version` | `string` | нет | `"1.0"` | Версия формата. |
| `id` | `string` | да | — | Идентификатор автоматизации. |
| `name` | `string` | да | — | Отображаемое имя. |
| `description` | `string \| null` | нет | `null` | Описание. |
| `trigger` | `Trigger[]` | нет | `[]` | Набор триггеров. |
| `parameters` | `Record<string, ScriptParameter>` | нет | `{}` | Объявления параметров сценария/запуска с default-значениями. |
| `entry` | `string` | да | — | ID первого шага; проверяется наличие такого ключа в `steps`. |
| `steps` | `Record<string, Step>` | нет | `{}` | Шаги, индексированные ID. |
| `expressions` | `Record<string, Expression>` | нет | `{}` | AST-выражения, индексированные ID. |
| `is_enabled` | `boolean` | нет | `true` | Признак включённой автоматизации. |

Схема связи: триггер вызывает автоматизацию; `entry` выбирает начальный узел; каждый узел задаёт переходы через `next`, `on_true`, `on_false` или `on_timeout`. Аргументы шагов и выражений могут ссылаться на значения из `expressions`.

## Параметры

`parameters` — словарь `ScriptParameter`. Поля:

| Поле | Тип | Обязательное | Default | Назначение |
|---|---|---:|---|---|
| `title` | `string` | да | — | Название параметра. |
| `description` | `string \| null` | нет | `null` | Пояснение. |
| `required` | `boolean` | нет | `true` | Метаданные обязательности параметра. |
| `definition` | `ValueParameter \| PathParameter` | да | — | Discriminated union по `definition.type`. |

`ValueParameter` имеет `type` из `number|string|boolean|time` (default `string`) и `default` типа `int|float|string|bool|null`. `PathParameter` имеет `type: "path"` и `default: string|null`. `extra="forbid"`.

В `AutomationContext` при создании для параметров применяются их defaults; переданные переменные контекста относятся к runtime и описаны в [variables.md](./variables.md). Не следует трактовать поле `required` как гарантию, что backend проверяет пользовательский ввод параметра: см. [валидацию](./validation.md).

## Пример корневого JSON

Все использованные здесь поля есть в модели; `entry` указывает на существующий шаг.

```json
{
  "schema_version": "1.0",
  "id": "evening-light",
  "name": "Вечерний свет",
  "description": "Включает свет по событию выключателя",
  "trigger": [
    {
      "type": "device",
      "device": "hall_switch",
      "field": "state"
    }
  ],
  "parameters": {},
  "entry": "turn_on",
  "steps": {
    "turn_on": {
      "type": "action",
      "command": "set_value",
      "params": {
        "path": {
          "type": "path",
          "path": "device.hall_light.state"
        },
        "value": {
          "type": "literal",
          "value": true,
          "data_type": "boolean"
        }
      }
    }
  },
  "expressions": {},
  "is_enabled": true
}
```

Пример иллюстрирует схему данных, но не гарантирует, что конкретные имена устройств/полей существуют в текущем установленном окружении.

## Связанные типы

### `ExpressionArg`

Дискриминируемое объединение `literal`, `ref`, `path`. Полные поля и правила разрешения — [expression-arguments.md](./expression-arguments.md).

### `Expression`

Дискриминируемое объединение `binary`, `unary`, `call`, `group`. Полный перечень операций — [expressions.md](./expressions.md).

### `Trigger`

`DeviceTrigger`, `RoomTrigger` либо `TimeTrigger` с `kind` `once`, `weekly`, `monthly`, `interval`; см. [triggers.md](./triggers.md).

### `Step`

`DelayStep`, `ActionStep`, `ConditionStep`, `AwaitStep` либо `ScriptActionStep`; см. [steps.md](./steps.md).

## Вспомогательные API-модели

`CommandParameter` описывает параметр команды: обязательные `name` и `title`; `data_type` из `number|string|boolean|any|path` (default `any`); `required` (default `true`); необязательный `description`.

`DeviceCommand` содержит обязательные `name`, `title`, `target`, необязательные `description` и `parameters` (default `[]`). `target` — enum `Target` в schema-модуле; список доступных команд выдаётся отдельным endpoint-ом, см. [api.md](./api.md).

`EnableSchema` с `is_enabled: bool = true` также объявлена в backend-схеме, однако текущий Automation V4 router её не использует и не предоставляет enable endpoint. Кроме того, manager не проверяет `AutomationSchema.is_enabled` при запуске. Это модельное поле не следует считать действующим переключателем.

## Known Issues

- В `Target` enum поля `SYSTEM="system",` и `ROOM="room",` объявлены с завершающей запятой и получают tuple values; фактическое поведение отличается от очевидных строковых значений.
- `EnableSchema` объявлена, но V4 router не реализует соответствующий endpoint; `is_enabled` не отключает регистрацию/выполнение.

## YAML

Хранилище загружает YAML и валидирует полученный объект тем же `AutomationSchema`; эквивалентный YAML для JSON-примера выше:

```yaml
schema_version: "1.0"
id: evening-light
name: Вечерний свет
description: Включает свет по событию выключателя
trigger:
  - type: device
    device: hall_switch
    field: state
parameters: {}
entry: turn_on
steps:
  turn_on:
    type: action
    command: set_value
    params:
      path:
        type: path
        path: device.hall_light.state
      value:
        type: literal
        value: true
        data_type: boolean
expressions: {}
is_enabled: true
```

## Валидационные особенности

- Обязательность полей, дискриминаторы, запрет неизвестных ключей и типы задаются Pydantic-моделями.
- `entry` должен совпадать с ключом `steps`.
- Каждый заданный `next`, `on_true`, `on_false`, `on_timeout` должен быть ключом `steps`.
- `RefArg.ref` допускается, если это ID выражения или строка, содержащая точку (так схема пропускает path-like ref; корректность конкретного пути проверяется при разрешении).
- Вложенные `RefArg` в шагах, выражениях и условиях device/room trigger проверяются корневым валидатором.
- Полная матрица проверок и границы статической валидации — [validation.md](./validation.md).
