# Аргументы выражений

## Связанные разделы

[README](./README.md) · [Выражения](./expressions.md) · [Переменные](./variables.md) · [Разрешение путей](./path-resolution.md) · [Контекст](./execution-context.md)

## `ExpressionArg`

`ExpressionArg` — discriminated union по `type`, определённый в `SmartHome/app/schemas/automation/automation_v4.py`. Аргументы используют выражения и шаги; конкретное место вычисления вызывает `resolve_arg`.

| Вариант | Назначение | Структура |
|---|---|---|
| `LiteralArg` | Непосредственное типизированное значение | `{"type":"literal","value":...,"data_type":"..."}` |
| `RefArg` | Ссылка на выражение либо path-like ссылку | `{"type":"ref","ref":"..."}` |
| `PathArg` | Путь к устройству, комнате, system-полю или переменной | `{"type":"path","path":"..."}` |

Неизвестные дополнительные поля запрещены в этих моделях.

## Литерал

`LiteralArg.value` допускает `int`, `float`, `str`, `bool` или `null`. `data_type` необязателен и принимает `number`, `string`, `boolean`, `time`, `duration`, `path`.

- Если `data_type` не задан, он выводится из Python-типа значения; `bool` проверяется до `int`.
- `null` требует явного `data_type`.
- Для `number`, `string`, `boolean`, `time` и `duration` проводится совместимость Python-типа; `time` и `duration` хранятся строками.
- `path` не имеет отдельной проверки содержимого на этапе валидатора literal.

```json
{"type":"literal","value":21,"data_type":"number"}
```

Runtime `resolve_literal` дополнительно преобразует `time` и `duration`. Поддерживаемые форматы и ошибки описаны в [expressions.md](./expressions.md).

## Ссылка `ref`

`RefArg.ref` — строка. Обычно это ID из корневого словаря `expressions`; при вычислении `evaluate_ref` находит AST и вычисляет его. Валидатор также допускает строку, содержащую точку, как похожую на путь. Для такого случая runtime пытается разрешить путь.

```json
{"type":"ref","ref":"is_warm"}
```

Ссылка на выражение может быть вложенной: AST-узел получает другой `RefArg`, тот снова разрешается через `evaluate_ref`. Циклы и чрезмерная глубина блокируются контекстом.

## Путь `path`

`PathArg.path` — строка, передаваемая `resolve_path`. Поддерживаемые корни и формы:

- `device.<system_name>.<field_id>`
- `room.<room_name>.<device_type>.<field>`
- `room.<room_name>.<field>`
- `system.<field>`
- `variable.<name>`

Точный алгоритм и известные различия — [path-resolution.md](./path-resolution.md).

```json
{"type":"path","path":"device.hall_light.brightness"}
```

## Как аргумент вычисляется

1. `resolve_arg(arg, ctx)` выбирает обработчик по Python-модели/типу аргумента.
2. Литерал передаётся в преобразователь literal.
3. `PathArg` направляется в `resolve_path`.
4. `RefArg` направляется в `evaluate_ref`: ID выражения вычисляется и кэшируется, path-like ref разрешается как путь; неизвестная ссылка приводит к ошибке.
5. Шаг или выражение использует полученное значение. Для `ActionStep.params["path"]` есть особый режим: если аргумент является `PathArg`, runner просит `resolve_path(..., preserve_path=True)`, чтобы передать строку пути обработчику действия, а не текущее значение поля.

Аргументы триггеров с `condition` — отдельный случай: их тип модели ограничен `RefArg`, это не произвольное выражение.

## Отличия «ссылка на ресурс» и «значение»

`{"type":"path","path":"device.x.state"}` в обычном контексте — запрос получить текущее значение поля. Для команды действия параметр `path` используется как адрес ресурса, поэтому runner сохраняет path-строку. Значение переменной, само содержащее путь, может быть рекурсивно разрешено, если оно начинается с известного namespace. См. [variables.md](./variables.md) и [step-action.md](./step-action.md).
