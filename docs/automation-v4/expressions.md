# Expression Engine

## Связанные разделы

[README](./README.md) · [Схема](./schema.md) · [Аргументы](./expression-arguments.md) · [Переменные](./variables.md) · [Пути](./path-resolution.md) · [API](./api.md) · [Ошибки](./error-handling.md)

## Структура Expression

`Expression` — discriminated union AST с `type`:

- `BinaryExpr`: `op`, `left`, `right`;
- `UnaryExpr`: `op`, `operand`;
- `CallExpr`: `fn`, `args` (список, default `[]`);
- `GroupExpr`: `op`, `items` (список, default `[]`).

Все дочерние элементы — `ExpressionArg`, а не вложенные `Expression` напрямую. Для рекурсивной композиции используются `RefArg`, указывающие на другие элементы корневого словаря `expressions`.

## Преобразования значений

- Числовые операции используют преобразование к числу: bool становится `0/1`, числа сохраняются, строки обрезаются по краям и парсятся как числа; прочие значения не подходят.
- `to_bool` распознаёт строки `true/1/on/yes` и `false/0/off/no/""` без учёта регистра; для других значений используется Python truthiness.
- `eq`/`ne` сначала сравнивают напрямую значения одного Python-типа; при разных типах пытаются сравнить их численно, иначе используют обычное равенство.
- Функция `bool` и unary `not` используют ту же bool-конверсию.

## Бинарные операции

Каждая строка представляет AST такого вида:
`{"type":"binary","op":"...","left":{"type":"literal",...},"right":{"type":"literal",...}}`.

| ID | Назначение и аргументы | Результат / ограничения |
|---|---|---|
| `eq` | Равенство двух значений | `boolean`; при разных типах выполняется numeric-coercion с fallback на обычное равенство. |
| `ne` | Неравенство двух значений | `boolean`; те же правила, что `eq`. |
| `lt` | Меньше; оба аргумента численно преобразуемы | `boolean`; ошибка преобразования для нечисловых значений. |
| `lte` | Меньше или равно; оба аргумента численно преобразуемы | `boolean`. |
| `gt` | Больше; оба аргумента численно преобразуемы | `boolean`. |
| `gte` | Больше или равно; оба аргумента численно преобразуемы | `boolean`. |
| `add` | Сложение двух численно преобразуемых аргументов | Число. |
| `sub` | Вычитание `left - right` | Число. |
| `mul` | Умножение двух аргументов | Число. |
| `div` | Деление `left / right` | Число; деление на ноль вызывает `ExpressionError`. |
| `mod` | Остаток от деления | Число; деление на ноль вызывает `ExpressionError`. |
| `pow` | Возведение `left` в степень `right` | Число; ошибки математики преобразуются/поднимаются как ошибки вычисления. |
| `concat` | Конкатенация двух аргументов через строковое представление | `string`, без разделителя. |
| `before` | Сравнить time-of-day двух значений | `boolean`; аргументы преобразуются в `datetime.time`; дата `datetime` игнорируется. |
| `after` | Аналогично `before`, знак сравнения «позже» | `boolean`. |

Все бинарные операции принимают ровно два `ExpressionArg`. Пример:

```json
{
  "type":"binary",
  "op":"gte",
  "left":{"type":"path","path":"device.room_sensor.temperature"},
  "right":{"type":"literal","value":20,"data_type":"number"}
}
```

Для `before`/`after` допускаются `time`, `datetime` (берётся `.time()`) либо строки, принимаемые `time.fromisoformat`; сравнение выполняется по времени суток.

## Унарные операции

`UnaryExpr` имеет форму `{"type":"unary","op":"...","operand":ExpressionArg}`; ровно один аргумент.

| ID | Вход | Результат / ограничения |
|---|---|---|
| `not` | Любое значение, приводимое через `to_bool` | `boolean`, отрицание truthiness. |
| `neg` | Численно преобразуемое значение | Число с обратным знаком. |

```json
{"type":"unary","op":"not","operand":{"type":"literal","value":false,"data_type":"boolean"}}
```

## Групповые операции

`GroupExpr` имеет форму `{"type":"group","op":"...","items":[ExpressionArg,...]}`; число элементов не ограничено схемой.

| ID | Аргументы | Результат / ограничения |
|---|---|---|
| `and` | Ноль или больше значений | `boolean`; short-circuit; пустая группа даёт `true`. |
| `or` | Ноль или больше значений | `boolean`; short-circuit; пустая группа даёт `false`. |
| `add` | Ноль или больше численно преобразуемых значений | Число, свёртка от `0`. |
| `mul` | Ноль или больше численно преобразуемых значений | Число, свёртка от `1`. |

```json
{"type":"group","op":"and","items":[
  {"type":"literal","value":true,"data_type":"boolean"},
  {"type":"literal","value":false,"data_type":"boolean"}
]}
```

## Функции

В `CallExpr` функция указывается строкой `fn`, аргументы — список `ExpressionArg`. Обычные функции сначала вычисляют все аргументы (eager); неизвестная функция вызывает `ExpressionError`. Ошибка внутри функции оборачивается в `ExpressionError` с названием функции.

| Имя | Аргументы | Результат |
|---|---|---|
| `min` | Один или больше численно преобразуемых; 0 вызывает ошибку Python `min` | Минимальное число. |
| `max` | Один или больше численно преобразуемых; 0 вызывает ошибку Python `max` | Максимальное число. |
| `abs` | Один численно преобразуемый | Абсолютное число. |
| `round` | 1 или 2: число и необязательное численное количество знаков, приводимое к `int` | Округлённое число. |
| `floor` | Один численно преобразуемый | Целое округление вниз. |
| `ceil` | Один численно преобразуемый | Целое округление вверх. |
| `int` | Один численно преобразуемый | `int`. |
| `float` | Один численно преобразуемый | `float`. |
| `str` | Один любой | Python string representation. |
| `bool` | Один любой | Результат `to_bool`. |
| `len` | Один `str`, `list`, `tuple` или `dict` | Длина; другие типы вызывают `ExpressionError`. |
| `lower` | Один любой, сначала строковое представление | Строка в нижнем регистре. |
| `upper` | Один любой, сначала строковое представление | Строка в верхнем регистре. |
| `contains` | Два любых значения, оба строкифицируются | `boolean`: второе в первом как подстрока. |
| `startswith` | Два любых значения, строкифицируются | `boolean`: первый начинается со второго. |
| `endswith` | Два любых значения, строкифицируются | `boolean`: первый заканчивается вторым. |
| `between` | Три численно преобразуемых: value, low, high | `boolean`, границы включены (`low <= value <= high`). |
| `now` | Без аргументов | Строка UTC времени `HH:MM:SS`. |
| `today` | Без аргументов | Строка UTC-даты ISO. |
| `if` | Ровно 3: condition, then, else | Значение выбранной ветки; ленивый вызов: condition и только выбранная ветка вычисляются. |
| `coalesce` | Любое число аргументов, включая 0 | Лениво возвращает первое не-`None`, иначе `None`. |

Таблица описывает намеренные сигнатуры и преобразования реализации. Для неверного числа аргументов обычная функция может породить исключение вызванной Python-функции, которое будет обёрнуто в `ExpressionError`; схема AST не проверяет arity заранее. Для `now`/`today` следует передавать пустой `args`.

Пример:

```json
{"type":"call","fn":"max","args":[
  {"type":"literal","value":18,"data_type":"number"},
  {"type":"path","path":"device.room_sensor.temperature"}
]}
```

`if` и `coalesce` — `_LAZY_FUNCTIONS`: их аргументы разрешаются по требованию, в отличие от функций `_FUNCTIONS`.

## Литералы времени и длительности

`LiteralArg` с `data_type: "time"` преобразуется в `datetime.time` (форматы принимаются `time.fromisoformat`, включая `HH:MM[:SS]`). `duration` преобразуется в `timedelta`: поддержаны число секунд, числовая строка, суффиксы `s/m/h/d`, `PT...`, `HH:MM[:SS]`. `time`/`duration` в сериализованной схеме остаются строками/числами допустимого literal типа. Примеры и поля — [expression-arguments.md](./expression-arguments.md).

## Рекурсия, кэширование и ошибки

`RefArg` вызывает `evaluate_ref`, который вычисляет AST по ID из `expressions`. Результат кэшируется в `AutomationContext`. Неизвестный ref, цикл и превышение `MAX_DEPTH=64` поднимают `ExpressionError`. Runner сбрасывает кэши перед шагом. Ошибки вычисления шага оборачиваются в `StepExecutionError`; см. [контекст](./execution-context.md) и [ошибки](./error-handling.md).

## Метаданные Expression API

Backend предоставляет `GET /api-devices/automation-v4/expression-capabilities`, возвращающий `types`, `operators`, `functions`, `argument_types`. Данные включают описания AST типов, операции/функции, примеры, arity, типы аргументов/результата и lazy/eager свойства функций. Ответ является deep copy; endpoint не изменяет runtime и не заменяет фактические модели.

Ниже — **сокращённый фрагмент фактического ответа**: по одному примеру на категорию; полный ответ содержит остальные типы, операторы, функции и аргументы.

```json
{
  "types": {
    "binary": {
      "id": "binary",
      "name": "Бинарное выражение",
      "description": "Применяет бинарный оператор к двум вычисляемым аргументам.",
      "json_shape": {
        "type": "binary",
        "op": "BinaryOp",
        "left": "ExpressionArg",
        "right": "ExpressionArg"
      },
      "required_fields": ["type", "op", "left", "right"],
      "optional_fields": [],
      "argument_types": ["literal", "ref", "path"],
      "example_json": {
        "type": "binary",
        "op": "add",
        "left": {"type": "literal", "value": 10},
        "right": {"type": "literal", "value": 3}
      }
    }
  },
  "operators": {
    "binary": [{
      "id": "eq",
      "name": "Равно",
      "category": "binary",
      "description": "Проверяет равенство; при разных типах сначала пытается числовое преобразование, затем сравнивает значения.",
      "argument_count": 2,
      "arguments": [
        {
          "name": "left", "position": 1, "required": true,
          "expression_arg_types": ["literal", "ref", "path"],
          "value_types": ["number", "string", "boolean", "time", "duration", "path"]
        },
        {
          "name": "right", "position": 2, "required": true,
          "expression_arg_types": ["literal", "ref", "path"],
          "value_types": ["number", "string", "boolean", "time", "duration", "path"]
        }
      ],
      "result_type": "boolean",
      "validation": "Оба операнда вычисляются до сравнения. null допустим только при явном data_type у литерала.",
      "example_json": {
        "type": "binary", "op": "eq",
        "left": {"type": "literal", "value": 10},
        "right": {"type": "literal", "value": 10}
      }
    }]
  },
  "functions": [{
    "id": "min",
    "name": "min",
    "description": "Возвращает наименьшее числовое значение.",
    "arguments": [{
      "name": "values", "position": "1..N", "required": true,
      "expression_arg_types": ["literal", "ref", "path"],
      "value_types": ["number", "numeric string", "boolean"]
    }],
    "min_args": 1,
    "max_args": null,
    "result_type": "number",
    "validation": "Принимает один или более аргументов; каждый преобразуется в число. Без аргументов вызывает ошибку.",
    "evaluation": "eager",
    "example_json": {
      "type": "call", "fn": "min",
      "args": [
        {"type": "literal", "value": 5},
        {"type": "literal", "value": 3},
        {"type": "literal", "value": 7}
      ]
    }
  }],
  "argument_types": {
    "literal": {
      "id": "literal",
      "description": "Константа. data_type выводится для bool, number и string, если не указан явно.",
      "format": {
        "type": "literal",
        "value": "number|string|boolean|null",
        "data_type": "number|string|boolean|time|duration|path"
      },
      "required_fields": ["type"],
      "optional_fields": ["value", "data_type"],
      "validation": "value=null требует явный data_type; заданный data_type проверяется по типу value. time/duration сохраняются в JSON строками и преобразуются при вычислении.",
      "example_json": {
        "type": "literal", "value": "22:30", "data_type": "time"
      }
    }
  }
}
```

Это representative subset, а не полный каталог: `types` включает `unary`, `call`, `group`; `operators` — бинарные, унарные и групповые операции; `argument_types` — также `ref` и `path`.
