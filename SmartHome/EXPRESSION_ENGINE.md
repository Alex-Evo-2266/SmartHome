# Expression Engine

Документ описывает фактическую реализацию Expression Engine. Машиночитаемый каталог поддерживаемых конструкций также доступен через API; frontend должен считать ответ API актуальным источником списка возможностей.

## 1. Назначение и вычисление

Expression Engine вычисляет AST-выражения в сценариях automation-v4. Выражение используется в шагах и может также храниться отдельно в `AutomationSchema.expressions`. Публичный вычислитель — `evaluate_expr`; аргументы выражений разрешает `resolve_arg`.

Общий процесс:

1. Pydantic разбирает JSON по дискриминатору `type`.
2. `evaluate_expr` выбирает обработчик бинарного, унарного, группового выражения или вызова функции.
3. Каждый `ExpressionArg` преобразуется в runtime-значение.
4. `RefArg` находит и вычисляет выражение из контекста сценария.

В AST нельзя напрямую вложить объект `Expression` в `left`, `operand`, `items` или `args`: там разрешён только `ExpressionArg`. Чтобы сослаться на вычисление, объявите его в `expressions` и передайте `{"type":"ref","ref":"<id>"}`.

## 2. Структура данных

Все модели выражений запрещают дополнительные поля. Имена полей и типы ниже соответствуют Pydantic-моделям `automation_v4`.

### Expression

`Expression` — объединение четырёх вариантов с обязательным полем-дискриминатором `type`:

| `type` | Обязательные поля | Необязательные поля | Назначение |
|---|---|---|---|
| `binary` | `type`, `op`, `left`, `right` | — | Бинарный оператор |
| `unary` | `type`, `op`, `operand` | — | Унарный оператор |
| `call` | `type`, `fn` | `args` (по умолчанию `[]`) | Вызов функции |
| `group` | `type`, `op` | `items` (по умолчанию `[]`) | Групповая операция |

`op` проверяется соответствующим enum модели. `fn` — строка; допустимость имени и количество аргументов проверяются вычислителем, а не моделью.

### ExpressionArg

`ExpressionArg` — дискриминируемое объединение `literal`, `ref` и `path`:

```json
{"type": "literal", "value": 21}
{"type": "ref", "ref": "temperature"}
{"type": "path", "path": "system.hour_minute"}
```

Для `LiteralArg` `data_type` выводится из простых значений (bool, число, строка), если его не указать. `bool` проверяется раньше `int`. `null` требует явного `data_type`. Возможны типы `number`, `string`, `boolean`, `time`, `duration`, `path`. Значения `time` и `duration` передаются строками; разбор происходит во время вычисления. Литерал с `data_type: "path"` возвращает переданное значение как есть и не разрешает `PathArg`.

`RefArg.ref` — идентификатор выражения в `AutomationSchema.expressions`; для его вычисления нужен `AutomationContext`. Вложенное значение вычисляется рекурсивно.

### Полный пример AutomationSchema с выражением

```json
{
  "id": "comfort",
  "name": "Comfort check",
  "entry": "check",
  "steps": {
    "check": {
      "type": "condition",
      "condition": {"type": "ref", "ref": "is_warm"}
    }
  },
  "expressions": {
    "is_warm": {
      "type": "binary",
      "op": "gt",
      "left": {"type": "path", "path": "device.room_sensor.temperature"},
      "right": {"type": "literal", "value": 21}
    }
  }
}
```

`device.room_sensor.temperature` здесь иллюстрирует форму пути; устройство и поле должны реально существовать в store.

## 3. Типы выражений

| Тип | JSON-структура | Пример |
|---|---|---|
| `binary` | `{"type":"binary","op":"<BinaryOp>","left":ExpressionArg,"right":ExpressionArg}` | `{"type":"binary","op":"add","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}` |
| `unary` | `{"type":"unary","op":"<UnaryOp>","operand":ExpressionArg}` | `{"type":"unary","op":"neg","operand":{"type":"literal","value":5}}` |
| `call` | `{"type":"call","fn":"<имя>","args":[ExpressionArg,...]}` | `{"type":"call","fn":"min","args":[{"type":"literal","value":5},{"type":"literal","value":3}]}` |
| `group` | `{"type":"group","op":"<GroupOp>","items":[ExpressionArg,...]}` | `{"type":"group","op":"and","items":[{"type":"literal","value":true},{"type":"literal","value":1}]}` |

`args` и `items` можно не передавать: модель подставит пустой список. Пустые групповые операции имеют определённые результаты, описанные ниже. Ошибки количества аргументов функций обнаруживаются при вычислении.

## 4. Бинарные операции

Оба поля `left` и `right` принимают любой `ExpressionArg`, включая ссылку на отдельное вычисляемое выражение. Все бинарные операторы вычисляют оба аргумента.

| ID | Назначение | Допустимые значения | Результат | Ограничения | JSON |
|---|---|---|---|---|---|
| `eq` | Равенство | Любые вычисляемые значения | boolean | При совпадающих Python-типах обычное сравнение; иначе попытка числового сравнения, при неудаче обычное равенство | `{"type":"binary","op":"eq","left":{"type":"literal","value":"25"},"right":{"type":"literal","value":25}}` |
| `ne` | Неравенство | Как `eq` | boolean | Отрицание результата `eq` | `{"type":"binary","op":"ne","left":{"type":"literal","value":5},"right":{"type":"literal","value":6}}` |
| `lt` | Меньше | Числа, bool, числовые строки | boolean | Оба аргумента преобразуются в число | `{"type":"binary","op":"lt","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}` |
| `lte` | Меньше или равно | Числа, bool, числовые строки | boolean | Числовое преобразование | `{"type":"binary","op":"lte","left":{"type":"literal","value":2},"right":{"type":"literal","value":2}}` |
| `gt` | Больше | Числа, bool, числовые строки | boolean | Числовое преобразование | `{"type":"binary","op":"gt","left":{"type":"literal","value":3},"right":{"type":"literal","value":2}}` |
| `gte` | Больше или равно | Числа, bool, числовые строки | boolean | Числовое преобразование | `{"type":"binary","op":"gte","left":{"type":"literal","value":3},"right":{"type":"literal","value":3}}` |
| `add` | Сложение | Числа, bool, числовые строки | number | Числовое преобразование | `{"type":"binary","op":"add","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}` |
| `sub` | Вычитание | Числа, bool, числовые строки | number | `left - right`, числовое преобразование | `{"type":"binary","op":"sub","left":{"type":"literal","value":5},"right":{"type":"literal","value":3}}` |
| `mul` | Умножение | Числа, bool, числовые строки | number | Числовое преобразование | `{"type":"binary","op":"mul","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}` |
| `div` | Деление | Числа, bool, числовые строки | number | Деление на ноль — `ExpressionError` | `{"type":"binary","op":"div","left":{"type":"literal","value":6},"right":{"type":"literal","value":2}}` |
| `mod` | Остаток | Числа, bool, числовые строки | number | Остаток от деления; нулевой делитель — `ExpressionError` | `{"type":"binary","op":"mod","left":{"type":"literal","value":7},"right":{"type":"literal","value":3}}` |
| `pow` | Возведение в степень | Числа, bool, числовые строки | number; для отрицательной базы и дробной степени возможен complex | Числовое преобразование | `{"type":"binary","op":"pow","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}` |
| `concat` | Конкатенация | Любые вычисляемые значения | string | Оба операнда преобразуются в строку, разделитель не добавляется | `{"type":"binary","op":"concat","left":{"type":"literal","value":"room-"},"right":{"type":"literal","value":2}}` |
| `before` | Время раньше | `time`, ISO-строка времени, `datetime` | boolean | Оба значения преобразуются в `datetime.time`; дата `datetime` отбрасывается | `{"type":"binary","op":"before","left":{"type":"literal","value":"08:00","data_type":"time"},"right":{"type":"literal","value":"22:00","data_type":"time"}}` |
| `after` | Время позже | `time`, ISO-строка времени, `datetime` | boolean | То же преобразование, что для `before` | `{"type":"binary","op":"after","left":{"type":"literal","value":"22:00","data_type":"time"},"right":{"type":"literal","value":"08:00","data_type":"time"}}` |

Числовое преобразование принимает int/float, bool (в 0/1) и числовые строки. Отрицательные сравнения `eq/ne` с разными типами могут перейти к обычному сравнению, если числовое преобразование невозможно.

## 5. Унарные операции

| ID | Описание | Аргумент / результат | JSON |
|---|---|---|---|
| `not` | Инверсия после преобразования в bool. Для строк `true`, `1`, `on`, `yes` — true; `false`, `0`, `off`, `no`, пустая строка — false; иначе применяется truthiness Python. | Один `ExpressionArg`; boolean | `{"type":"unary","op":"not","operand":{"type":"literal","value":"false"}}` |
| `neg` | Числовое отрицание | Один числовой `ExpressionArg` (включая числовую строку и bool); number | `{"type":"unary","op":"neg","operand":{"type":"literal","value":5}}` |

## 6. Групповые операции

`items` — массив `ExpressionArg`; ограничение на максимальное число элементов не задаётся.

| ID | Смысл и правила | Пустой список | JSON |
|---|---|---|---|
| `and` | Приводит элементы к bool; short-circuit на первом false | true | `{"type":"group","op":"and","items":[{"type":"literal","value":true},{"type":"literal","value":1}]}` |
| `or` | Приводит элементы к bool; short-circuit на первом true | false | `{"type":"group","op":"or","items":[{"type":"literal","value":false},{"type":"literal","value":true}]}` |
| `add` | Последовательно складывает числовые значения | 0 | `{"type":"group","op":"add","items":[{"type":"literal","value":1},{"type":"literal","value":2},{"type":"literal","value":3}]}` |
| `mul` | Последовательно перемножает числовые значения | 1 | `{"type":"group","op":"mul","items":[{"type":"literal","value":2},{"type":"literal","value":3}]}` |

## 7. Функции

Обычные функции сначала вычисляют все аргументы слева направо. `if` и `coalesce` ленивые. Сигнатуры и примеры:

| ID | Аргументы | Результат и ограничения | JSON |
|---|---|---|---|
| `min` | 1..N числовых значений | Минимум; каждый аргумент преобразуется в число | `{"type":"call","fn":"min","args":[{"type":"literal","value":5},{"type":"literal","value":3},{"type":"literal","value":7}]}` |
| `max` | 1..N числовых значений | Максимум; каждый аргумент преобразуется в число | `{"type":"call","fn":"max","args":[{"type":"literal","value":5},{"type":"literal","value":3},{"type":"literal","value":7}]}` |
| `abs` | `value` — число | Абсолютное значение | `{"type":"call","fn":"abs","args":[{"type":"literal","value":-5}]}` |
| `round` | `value` обязательно; `ndigits` опционально, default `0` | Округление; `ndigits` приводится к int | `{"type":"call","fn":"round","args":[{"type":"literal","value":3.14159},{"type":"literal","value":2}]}` |
| `floor` | `value` — число | Округление вниз; integer | `{"type":"call","fn":"floor","args":[{"type":"literal","value":3.9}]}` |
| `ceil` | `value` — число | Округление вверх; integer | `{"type":"call","fn":"ceil","args":[{"type":"literal","value":3.1}]}` |
| `int` | `value` — число или числовая строка | Целое; дробная часть отбрасывается | `{"type":"call","fn":"int","args":[{"type":"literal","value":"42"}]}` |
| `float` | `value` — число или числовая строка | Число с плавающей точкой | `{"type":"call","fn":"float","args":[{"type":"literal","value":"3.14"}]}` |
| `str` | `value` — любое вычисляемое значение | Строковое представление Python | `{"type":"call","fn":"str","args":[{"type":"literal","value":42}]}` |
| `bool` | `value` — любое вычисляемое значение | Преобразование в bool по правилам `not` | `{"type":"call","fn":"bool","args":[{"type":"literal","value":"true"}]}` |
| `len` | `value` — строка или runtime-коллекция | Длина str/list/tuple/dict; LiteralArg сам по себе не представляет коллекции | `{"type":"call","fn":"len","args":[{"type":"literal","value":"hello"}]}` |
| `lower` | `value` — любое вычисляемое значение | Сначала str, затем нижний регистр | `{"type":"call","fn":"lower","args":[{"type":"literal","value":"Hello"}]}` |
| `upper` | `value` — любое вычисляемое значение | Сначала str, затем верхний регистр | `{"type":"call","fn":"upper","args":[{"type":"literal","value":"hello"}]}` |
| `contains` | `haystack`, `needle` | Проверка `str(needle) in str(haystack)`, чувствительна к регистру | `{"type":"call","fn":"contains","args":[{"type":"literal","value":"hello world"},{"type":"literal","value":"world"}]}` |
| `startswith` | `value`, `prefix` | Оба преобразуются в str; чувствительно к регистру | `{"type":"call","fn":"startswith","args":[{"type":"literal","value":"hello"},{"type":"literal","value":"he"}]}` |
| `endswith` | `value`, `suffix` | Оба преобразуются в str; чувствительно к регистру | `{"type":"call","fn":"endswith","args":[{"type":"literal","value":"hello"},{"type":"literal","value":"lo"}]}` |
| `between` | `value`, `low`, `high` — числа | Проверка закрытого диапазона `low <= value <= high` | `{"type":"call","fn":"between","args":[{"type":"literal","value":15},{"type":"literal","value":10},{"type":"literal","value":20}]}` |
| `now` | нет аргументов | Текущее время UTC, `HH:MM:SS` | `{"type":"call","fn":"now","args":[]}` |
| `today` | нет аргументов | Текущая дата UTC, `YYYY-MM-DD` | `{"type":"call","fn":"today","args":[]}` |
| `if` | ровно `condition`, `then`, `else` | bool-условие; вычисляется только выбранная ветвь; результат — значение выбранной ветви | `{"type":"call","fn":"if","args":[{"type":"literal","value":true},{"type":"literal","value":"yes"},{"type":"literal","value":"no"}]}` |
| `coalesce` | 0..N значений | Возвращает первое не-null; аргументы вычисляются по очереди; пустой список или все null дают null | `{"type":"call","fn":"coalesce","args":[{"type":"literal","value":null,"data_type":"string"},{"type":"literal","value":"fallback"}]}` |

Для `min`/`max` передавайте отдельный `ExpressionArg` на каждое значение — функция не принимает массив значений одним аргументом. При нуле аргументов вычисление выдаёт ошибку.

## 8. Типы аргументов и пути

| ID | Поля и формат | Валидация / применение | Пример |
|---|---|---|---|
| `literal` | `type`, `value`, опционально `data_type` | JSON scalar: number/string/boolean/null. null требует явный `data_type`. `time` разбирается через ISO `time`; `duration` поддерживает секунды числом/строкой, `HH:MM[:SS]`, суффиксы `s/m/h/d` и ISO 8601 | `{"type":"literal","value":"PT2M","data_type":"duration"}` |
| `ref` | `type`, `ref` — id выражения | Нужен контекст и существующее выражение; выявляются циклы; подходит для аргументов любого узла | `{"type":"ref","ref":"temperature_check"}` |
| `path` | `type`, `path` | Форма пути проверяется в момент разрешения; значение зависит от runtime store | `{"type":"path","path":"system.weekday"}` |

Поддерживаемые пути:

- `device.<system_name>.<field_id>` — чтение состояния существующего устройства. BINARY-нормализация принимает bool, 0/1, строки true/false, on/off и yes/no; NUMBER и COUNTER нормализуются, TEXT/ENUM/BASE возвращаются как есть.
- `system.time`, `system.hour_minute`, `system.date`, `system.weekday`, `system.timestamp`, `system.utc_offset` — значения UTC; weekday: 0=Пн … 6=Вс.
- `variable.<name>` — форма распознаётся, но пока приводит к `NotImplementedError`.

Неизвестный system-путь, неизвестный prefix, отсутствующее устройство/поле или пустое значение устройства не заменяются на null, а приводят к ошибке.

## 9. Ссылки и сложные выражения

Сложение внутри сравнения оформляется отдельным expression в `expressions`, а не вложенным JSON-объектом в `left`:

```json
{
  "expressions": {
    "sum": {
      "type": "binary",
      "op": "add",
      "left": {"type": "literal", "value": 2},
      "right": {"type": "literal", "value": 3}
    },
    "is_five": {
      "type": "binary",
      "op": "eq",
      "left": {"type": "ref", "ref": "sum"},
      "right": {"type": "literal", "value": 5}
    }
  }
}
```

Другие проверяемые модели JSON:

```json
{"type":"binary","op":"gt","left":{"type":"path","path":"device.room_sensor.temperature"},"right":{"type":"literal","value":20}}
```

```json
{"type":"group","op":"and","items":[{"type":"ref","ref":"is_five"},{"type":"binary","op":"before","left":{"type":"literal","value":"08:00","data_type":"time"},"right":{"type":"literal","value":"22:00","data_type":"time"}}]}
```

```json
{"type":"call","fn":"min","args":[{"type":"ref","ref":"sum"},{"type":"literal","value":10}]}
```

Чтобы выбрать безопасную ветку, `if` вычисляет условие и только одну ветвь, например `if(x != 0, 10 / x, 0)`. Неразрешимая ссылка в невыбранной ветви не вычисляется.

`AutomationContext.MAX_DEPTH` ограничивает глубину цепочки вычисляемых `ref` значением 64; также выявляются циклические ссылки. Рекурсия здесь строится ссылками между expression ID, а не вложенными JSON-объектами.

## 10. Порядок вычисления, кэш и ошибки

- Binary: left, затем right, после чего применяется оператор.
- Unary: вычисляется operand, затем преобразование/операция.
- Eager function: все `args` вычисляются слева направо, затем вызывается функция.
- Lazy `if`: вычисляется condition и только выбранная ветвь.
- Lazy `coalesce`: аргументы вычисляются по очереди до первого не-null.
- Group `and`/`or`: вычисления прекращаются при первом достаточном значении. `add`/`mul` обрабатывают список слева направо.
- `RefArg` вычисляется по id и кешируется до сброса контекста. `PathArg` кешируется по path. Runner сбрасывает оба кэша перед каждым шагом.
- Повторное вычисление после `AutomationContext.invalidate()` читает актуальное состояние стора.

Деление и остаток на ноль, неизвестная функция, ошибка функций и проблемы ссылки приводят к `ExpressionError`. Некоторые ошибки преобразования чисел/времени могут быть `TypeError` или `ValueError`; вычислитель не превращает каждую такую ошибку в один универсальный тип.

На текущий момент есть расхождение в проверке `RefArg`: модель AutomationSchema допускает несуществующий `ref` с точкой, но runtime-резолвер всё равно ищет точный ID в `expressions`. Используйте `PathArg` для путей, а `RefArg` — только для ID объявленных выражений.

## 11. API возможностей

- **Метод:** `GET`
- **URL:** `/api-devices/automation-v4/expression-capabilities`
- **Авторизация:** endpoint не требует `auth_privilege_dep`, как и существующий публичный список команд automation-v4.
- **Ответ:** JSON с ключами `types`, `operators` (`binary`, `unary`, `group`), `functions`, `argument_types`.

Для каждого типа ответа содержит форму JSON, требуемые/необязательные поля, аргументные типы и проверенный пример. Для оператора — идентификатор, категорию, аргументы, тип результата, валидацию и пример. Для функции — сигнатуру, кратность аргументов, тип результата, eager/lazy режим, ограничения и пример. В примерах используются те же модели, что и при разборе сценария.

Пример структуры ответа:

```json
{
  "types": {
    "binary": {
      "id": "binary",
      "required_fields": ["type", "op", "left", "right"],
      "example_json": {
        "type": "binary",
        "op": "add",
        "left": {"type": "literal", "value": 10},
        "right": {"type": "literal", "value": 3}
      }
    }
  },
  "operators": {
    "binary": [{"id": "eq", "category": "binary", "argument_count": 2}],
    "unary": [{"id": "not", "category": "unary", "argument_count": 1}],
    "group": [{"id": "and", "category": "group", "argument_count": {"minimum": 0, "maximum": null}}]
  },
  "functions": [
    {"id": "min", "min_args": 1, "max_args": null, "evaluation": "eager"}
  ],
  "argument_types": {
    "literal": {"id": "literal"},
    "ref": {"id": "ref"},
    "path": {"id": "path"}
  }
}
```

Сокращённый JSON выше показывает форму, а не заменяет фактические списки в полном HTTP-ответе. Frontend должен получать каталог при необходимости и строить UI по `id`, сигнатурам и примерам; не следует поддерживать собственную копию списка операторов и функций.

## 12. Готовые выражения и ожидаемый результат

**Константное бинарное выражение — 5:**

```json
{"type":"binary","op":"add","left":{"type":"literal","value":2},"right":{"type":"literal","value":3}}
```

**Бинарное сравнение — true:**

```json
{"type":"binary","op":"gt","left":{"type":"literal","value":"25"},"right":{"type":"literal","value":20}}
```

**Унарное выражение — -5:**

```json
{"type":"unary","op":"neg","operand":{"type":"literal","value":5}}
```

**Групповая сумма — 10:**

```json
{"type":"group","op":"add","items":[{"type":"literal","value":1},{"type":"literal","value":2},{"type":"literal","value":3},{"type":"literal","value":4}]}
```

**min и max — 3 и 7:**

```json
{"type":"call","fn":"min","args":[{"type":"literal","value":5},{"type":"literal","value":3},{"type":"literal","value":7}]}
```

```json
{"type":"call","fn":"max","args":[{"type":"literal","value":5},{"type":"literal","value":3},{"type":"literal","value":7}]}
```

**Вложенная через ref сумма и выбор:**

```json
{
  "expressions": {
    "sum": {
      "type": "binary",
      "op": "add",
      "left": {"type": "literal", "value": 5},
      "right": {"type": "literal", "value": 3}
    },
    "is_large": {
      "type": "binary",
      "op": "gt",
      "left": {"type": "ref", "ref": "sum"},
      "right": {"type": "literal", "value": 7}
    },
    "label": {
      "type": "call",
      "fn": "if",
      "args": [
        {"type": "ref", "ref": "is_large"},
        {"type": "literal", "value": "large"},
        {"type": "literal", "value": "small"}
      ]
    }
  }
}
```

`sum` равен 8, `is_large` равен true, `label` равен `"large"`.

### Ограничения реализации

- Выражения в `ExpressionArg` не вкладываются непосредственно: для composition используется `RefArg`.
- Максимальная глубина цепочки `ref` — 64.
- Переменные `variable.*` пока не реализованы.
- `fn` и число аргументов большинства функций не валидируются при создании Pydantic-модели, ошибка возникает в runtime.
- `len` имеет в реализации поддержку Python-коллекций, но LiteralArg передаёт только JSON scalar; фактическая доступность коллекции зависит от других аргументов.
