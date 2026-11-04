# Разрешение путей

## Связанные разделы

[README](./README.md) · [Аргументы](./expression-arguments.md) · [Переменные](./variables.md) · [Контекст](./execution-context.md) · [Действия](./step-action.md) · [Ошибки](./error-handling.md)

## `resolve_path`

`resolve_path(arg, ctx, preserve_path=False)` — runtime resolver строкового адреса. Обычный вызов получает значение ресурса; `preserve_path=True` возвращает/сохраняет саму адресную строку для параметра действия.

| Namespace | Форма | Результат |
|---|---|---|
| `device` | `device.<system_name>.<field_id>` | Значение поля устройства. |
| `room` | `room.<room_name>.<device_type>.<field>` | Значение поля выбранного типа устройств в комнате. |
| `room` | `room.<room_name>.<field>` | Поддерживаемая resolver-ом укороченная форма room-пути. |
| `system` | `system.<field>` | Системное значение из ограниченного набора ниже. |
| `variable` | `variable.<name>` | Значение контекстной переменной, при необходимости рекурсивно разрешённое как путь. |

## Системные поля

`system.*` поддерживает: `time`, `hour_minute`, `date`, `weekday`, `timestamp`, `utc_offset`. Эти значения формируются resolver-ом; timezone/формат следует трактовать ровно по реализации текущего окружения. В частности, функции `now()`/`today()` в Expression отдельно возвращают UTC.

## Разбор устройства и нормализация

Для устройства resolver получает поле по system name и field ID. Значения преобразуются согласно типу поля:

- `BINARY` — в bool (`_normalize_binary`);
- `NUMBER`/`COUNTER` — в числовое значение (`_normalize_number`);
- `TEXT`/`ENUM`/`BASE` — исходное значение.

Поддержка дополнительных типов полей определяется кодом resolver и фактическими моделями устройства.

## Переменные и рекурсия

`variable.<name>` работает только при наличии `AutomationContext`. Отсутствующая переменная приводит к ошибке. Если значение переменной — строка с распознаваемым namespace-префиксом, оно разрешается повторным вызовом `resolve_path`; циклы отслеживаются контекстом. Подробнее: [variables.md](./variables.md), [execution-context.md](./execution-context.md).

## Путь как адрес и как значение

При `resolve_path("device.x.state")` без preserve resolver читает состояние поля. В `ActionStep` параметр `path` является адресом, поэтому runner для `PathArg` передаёт `preserve_path=True`. Так действие может получить строку `device.x.state`, а не текущее состояние. См. [step-action.md](./step-action.md).

## Кэширование, ограничения и ошибки

Контекст содержит `_path_cache`, используемый resolver-ом; кэши очищаются runner перед каждым шагом, поэтому не являются неизменяемым кэшем всего сценария. Ограничения глубины и циклов для переменных/выражений описаны в [execution-context.md](./execution-context.md). Неизвестный namespace, отсутствующее устройство/комната/поле или некорректная форма пути приводят к ошибке разрешения, а не к фиктивному значению.
