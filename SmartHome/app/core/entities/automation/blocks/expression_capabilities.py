"""Client-facing metadata for the expression evaluator."""
from __future__ import annotations

from typing import Any

from app.schemas.automation.automation_v4 import (
    BinaryOp,
    GroupOp,
    UnaryOp,
)


_ARG_TYPES = ["literal", "ref", "path"]
_NO_DEFAULT = object()


def _literal(value: Any, data_type: str | None = None) -> dict[str, Any]:
    result: dict[str, Any] = {"type": "literal", "value": value}
    if data_type is not None:
        result["data_type"] = data_type
    return result


def _binary(
    op: BinaryOp,
    name: str,
    description: str,
    value_types: list[str],
    result_type: str,
    validation: str,
    left: dict[str, Any],
    right: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": op.value,
        "name": name,
        "category": "binary",
        "description": description,
        "argument_count": 2,
        "arguments": [
            {
                "name": "left",
                "position": 1,
                "required": True,
                "expression_arg_types": _ARG_TYPES,
                "value_types": value_types,
            },
            {
                "name": "right",
                "position": 2,
                "required": True,
                "expression_arg_types": _ARG_TYPES,
                "value_types": value_types,
            },
        ],
        "result_type": result_type,
        "validation": validation,
        "example_json": {
            "type": "binary",
            "op": op.value,
            "left": left,
            "right": right,
        },
    }


_NUMBER_LEFT = _literal(10)
_NUMBER_RIGHT = _literal(3)
_STRING_LEFT = _literal("hello ")
_STRING_RIGHT = _literal("world")
_TIME_LEFT = _literal("08:00", "time")
_TIME_RIGHT = _literal("22:00", "time")
_ANY_VALUES = ["number", "string", "boolean", "time", "duration", "path"]
_NUMBER_VALUES = ["number", "numeric string", "boolean"]


_BINARY_OPERATORS = [
    _binary(
        BinaryOp.EQ,
        "Равно",
        "Проверяет равенство; при разных типах сначала пытается числовое "
        "преобразование, затем сравнивает значения.",
        _ANY_VALUES,
        "boolean",
        "Оба операнда вычисляются до сравнения. null допустим только при "
        "явном data_type у литерала.",
        _NUMBER_LEFT,
        _literal(10),
    ),
    _binary(
        BinaryOp.NE,
        "Не равно",
        "Логическое отрицание eq с теми же правилами сравнения.",
        _ANY_VALUES,
        "boolean",
        "Оба операнда вычисляются до сравнения.",
        _NUMBER_LEFT,
        _literal(3),
    ),
    _binary(
        BinaryOp.LT, "Меньше", "Сравнивает два числовых значения.",
        _NUMBER_VALUES, "boolean",
        "Оба значения преобразуются в число; строка должна содержать число.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.LTE, "Меньше или равно",
        "Сравнивает два числовых значения с включённой границей.",
        _NUMBER_VALUES, "boolean",
        "Оба значения преобразуются в число; строка должна содержать число.",
        _NUMBER_LEFT, _literal(10),
    ),
    _binary(
        BinaryOp.GT, "Больше", "Сравнивает два числовых значения.",
        _NUMBER_VALUES, "boolean",
        "Оба значения преобразуются в число; строка должна содержать число.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.GTE, "Больше или равно",
        "Сравнивает два числовых значения с включённой границей.",
        _NUMBER_VALUES, "boolean",
        "Оба значения преобразуются в число; строка должна содержать число.",
        _NUMBER_LEFT, _literal(10),
    ),
    _binary(
        BinaryOp.ADD, "Сложение", "Складывает числовые значения.",
        _NUMBER_VALUES, "number", "Оба значения преобразуются в число.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.SUB, "Вычитание", "Вычитает правый операнд из левого.",
        _NUMBER_VALUES, "number", "Оба значения преобразуются в число.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.MUL, "Умножение", "Перемножает числовые значения.",
        _NUMBER_VALUES, "number", "Оба значения преобразуются в число.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.DIV, "Деление", "Делит левый операнд на правый.",
        _NUMBER_VALUES, "number",
        "Оба значения преобразуются в число; деление на ноль вызывает "
        "ExpressionError.",
        _NUMBER_LEFT, _literal(2),
    ),
    _binary(
        BinaryOp.MOD, "Остаток от деления",
        "Возвращает остаток от деления левого операнда на правый.",
        _NUMBER_VALUES, "number",
        "Оба значения преобразуются в число; нулевой делитель вызывает "
        "ExpressionError.",
        _NUMBER_LEFT, _NUMBER_RIGHT,
    ),
    _binary(
        BinaryOp.POW, "Степень",
        "Возводит левый операнд в степень правого.",
        _NUMBER_VALUES, "number | complex",
        "Оба значения преобразуются в число.",
        _literal(2), _literal(3),
    ),
    _binary(
        BinaryOp.CONCAT, "Конкатенация",
        "Преобразует оба значения в строки и соединяет их без разделителя.",
        _ANY_VALUES, "string",
        "Оба значения преобразуются через f-string.",
        _STRING_LEFT, _STRING_RIGHT,
    ),
    _binary(
        BinaryOp.BEFORE, "Раньше",
        "Проверяет, что левое время раньше правого.",
        ["time", "ISO-время", "datetime"], "boolean",
        "Значения преобразуются в datetime.time; datetime теряет дату, "
        "некорректная строка вызывает ошибку.",
        _TIME_LEFT, _TIME_RIGHT,
    ),
    _binary(
        BinaryOp.AFTER, "Позже",
        "Проверяет, что левое время позже правого.",
        ["time", "ISO-время", "datetime"], "boolean",
        "Значения преобразуются в datetime.time; datetime теряет дату, "
        "некорректная строка вызывает ошибку.",
        _TIME_RIGHT, _TIME_LEFT,
    ),
]

_UNARY_OPERATORS = [
    {
        "id": UnaryOp.NOT.value,
        "name": "Логическое НЕ",
        "category": "unary",
        "description": "Инвертирует значение после преобразования в bool.",
        "argument_count": 1,
        "arguments": [{
            "name": "operand",
            "position": 1,
            "required": True,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _ANY_VALUES,
        }],
        "result_type": "boolean",
        "validation": "Строки true/1/on/yes трактуются как True; false/0/off/no/пустая строка — как False; остальные значения используют обычную truthiness Python.",
        "example_json": {"type": "unary", "op": "not", "operand": _literal(False)},
    },
    {
        "id": UnaryOp.NEG.value,
        "name": "Унарный минус",
        "category": "unary",
        "description": "Возвращает отрицательное числовое значение.",
        "argument_count": 1,
        "arguments": [{
            "name": "operand",
            "position": 1,
            "required": True,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _NUMBER_VALUES,
        }],
        "result_type": "number",
        "validation": "Операнд преобразуется в число; bool допускается и становится 0 или 1.",
        "example_json": {"type": "unary", "op": "neg", "operand": _literal(5)},
    },
]

_GROUP_OPERATORS = [
    {
        "id": GroupOp.AND.value,
        "name": "Логическое И",
        "category": "group",
        "description": "Возвращает True, если все элементы истинны; прекращает вычисление на первом ложном.",
        "argument_count": {"minimum": 0, "maximum": None},
        "arguments": [{
            "name": "items",
            "position": "1..N",
            "required": False,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _ANY_VALUES,
        }],
        "result_type": "boolean",
        "validation": "Преобразует каждый вычисленный элемент в bool. Для пустого списка возвращает True.",
        "example_json": {"type": "group", "op": "and", "items": [_literal(True), _literal(1)]},
    },
    {
        "id": GroupOp.OR.value,
        "name": "Логическое ИЛИ",
        "category": "group",
        "description": "Возвращает True на первом истинном элементе; прекращает вычисление.",
        "argument_count": {"minimum": 0, "maximum": None},
        "arguments": [{
            "name": "items",
            "position": "1..N",
            "required": False,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _ANY_VALUES,
        }],
        "result_type": "boolean",
        "validation": "Преобразует каждый вычисленный элемент в bool. Для пустого списка возвращает False.",
        "example_json": {"type": "group", "op": "or", "items": [_literal(False), _literal(True)]},
    },
    {
        "id": GroupOp.ADD.value,
        "name": "Сумма",
        "category": "group",
        "description": "Последовательно складывает все элементы, используя те же числовые преобразования, что и add.",
        "argument_count": {"minimum": 0, "maximum": None},
        "arguments": [{
            "name": "items",
            "position": "1..N",
            "required": False,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _NUMBER_VALUES,
        }],
        "result_type": "number",
        "validation": "Каждый элемент преобразуется в число. Для пустого списка возвращает 0.",
        "example_json": {"type": "group", "op": "add", "items": [_literal(1), _literal(2), _literal(3)]},
    },
    {
        "id": GroupOp.MUL.value,
        "name": "Произведение",
        "category": "group",
        "description": "Последовательно перемножает все элементы.",
        "argument_count": {"minimum": 0, "maximum": None},
        "arguments": [{
            "name": "items",
            "position": "1..N",
            "required": False,
            "expression_arg_types": _ARG_TYPES,
            "value_types": _NUMBER_VALUES,
        }],
        "result_type": "number",
        "validation": "Каждый элемент преобразуется в число. Для пустого списка возвращает 1.",
        "example_json": {"type": "group", "op": "mul", "items": [_literal(2), _literal(3)]},
    },
]


def _fn(
    name: str,
    description: str,
    arguments: list[dict[str, Any]],
    min_args: int,
    max_args: int | None,
    result_type: str,
    validation: str,
    example_args: list[dict[str, Any]],
    *,
    lazy: bool = False,
) -> dict[str, Any]:
    return {
        "id": name,
        "name": name,
        "description": description,
        "arguments": arguments,
        "min_args": min_args,
        "max_args": max_args,
        "result_type": result_type,
        "validation": validation,
        "evaluation": "lazy" if lazy else "eager",
        "example_json": {"type": "call", "fn": name, "args": example_args},
    }


def _fn_arg(
    name: str,
    position: int | str,
    value_types: list[str],
    *,
    required: bool = True,
    default: Any = _NO_DEFAULT,
) -> dict[str, Any]:
    result = {
        "name": name,
        "position": position,
        "required": required,
        "expression_arg_types": _ARG_TYPES,
        "value_types": value_types,
    }
    if default is not _NO_DEFAULT:
        result["default"] = default
    return result


_ONE_NUMBER = [_fn_arg("value", 1, _NUMBER_VALUES)]
_ANY_ONE = [_fn_arg("value", 1, _ANY_VALUES)]
_FUNCTIONS = [
    _fn(
        "min",
        "Возвращает наименьшее числовое значение.",
        [_fn_arg("values", "1..N", _NUMBER_VALUES)],
        1, None, "number",
        "Принимает один или более аргументов; каждый преобразуется в число. "
        "Без аргументов вызывает ошибку.",
        [_literal(5), _literal(3), _literal(7)],
    ),
    _fn(
        "max",
        "Возвращает наибольшее числовое значение.",
        [_fn_arg("values", "1..N", _NUMBER_VALUES)],
        1, None, "number",
        "Принимает один или более аргументов; каждый преобразуется в число. "
        "Без аргументов вызывает ошибку.",
        [_literal(5), _literal(3), _literal(7)],
    ),
    _fn(
        "abs", "Возвращает абсолютное числовое значение.",
        _ONE_NUMBER, 1, 1, "number",
        "Аргумент преобразуется в число.", [_literal(-5)],
    ),
    _fn(
        "round",
        "Округляет значение; второй аргумент задаёт число знаков после запятой.",
        [
            _fn_arg("value", 1, _NUMBER_VALUES),
            _fn_arg("ndigits", 2, _NUMBER_VALUES, required=False, default=0),
        ],
        1, 2, "number",
        "Принимает 1 или 2 аргумента. ndigits преобразуется через число в int; "
        "по умолчанию равен 0.",
        [_literal(3.14159), _literal(2)],
    ),
    _fn(
        "floor", "Округляет вниз до целого.",
        _ONE_NUMBER, 1, 1, "integer",
        "Аргумент преобразуется в число.", [_literal(3.9)],
    ),
    _fn(
        "ceil", "Округляет вверх до целого.",
        _ONE_NUMBER, 1, 1, "integer",
        "Аргумент преобразуется в число.", [_literal(3.1)],
    ),
    _fn(
        "int", "Преобразует значение в целое число.",
        _ONE_NUMBER, 1, 1, "integer",
        "Сначала преобразует значение в int или float, затем в int; "
        "дробная часть отбрасывается.",
        [_literal("42")],
    ),
    _fn(
        "float", "Преобразует значение в число с плавающей точкой.",
        _ONE_NUMBER, 1, 1, "number",
        "Аргумент должен быть числом или числовой строкой.",
        [_literal("3.14")],
    ),
    _fn(
        "str", "Преобразует значение в строку Python.",
        _ANY_ONE, 1, 1, "string",
        "Поддерживается одно значение любого вычисляемого типа.",
        [_literal(42)],
    ),
    _fn(
        "bool", "Преобразует значение в bool по правилам Expression Engine.",
        _ANY_ONE, 1, 1, "boolean",
        "Для строк специальные истинные значения: true/1/on/yes; ложные: "
        "false/0/off/no/пустая строка.",
        [_literal("false")],
    ),
    _fn(
        "len", "Возвращает длину строки или коллекции.",
        _ANY_ONE, 1, 1, "integer",
        "Поддерживаются str, list, tuple и dict; неподдерживаемый тип вызывает "
        "ExpressionError. LiteralArg не кодирует коллекции.",
        [_literal("hello")],
    ),
    _fn(
        "lower", "Преобразует строковое представление значения в нижний регистр.",
        _ANY_ONE, 1, 1, "string",
        "Аргумент сначала приводится к str.", [_literal("Hello")],
    ),
    _fn(
        "upper", "Преобразует строковое представление значения в верхний регистр.",
        _ANY_ONE, 1, 1, "string",
        "Аргумент сначала приводится к str.", [_literal("hello")],
    ),
    _fn(
        "contains",
        "Проверяет наличие подстроки в строковом представлении значения.",
        [
            _fn_arg("haystack", 1, _ANY_VALUES),
            _fn_arg("needle", 2, _ANY_VALUES),
        ],
        2, 2, "boolean",
        "Оба аргумента преобразуются в str; проверка чувствительна к регистру.",
        [_literal("hello world"), _literal("world")],
    ),
    _fn(
        "startswith", "Проверяет начало строкового представления значения.",
        [
            _fn_arg("value", 1, _ANY_VALUES),
            _fn_arg("prefix", 2, _ANY_VALUES),
        ],
        2, 2, "boolean",
        "Оба аргумента преобразуются в str; проверка чувствительна к регистру.",
        [_literal("hello"), _literal("he")],
    ),
    _fn(
        "endswith", "Проверяет окончание строкового представления значения.",
        [
            _fn_arg("value", 1, _ANY_VALUES),
            _fn_arg("suffix", 2, _ANY_VALUES),
        ],
        2, 2, "boolean",
        "Оба аргумента преобразуются в str; проверка чувствительна к регистру.",
        [_literal("hello"), _literal("lo")],
    ),
    _fn(
        "between", "Проверяет попадание числа в закрытый диапазон [low, high].",
        [
            _fn_arg("value", 1, _NUMBER_VALUES),
            _fn_arg("low", 2, _NUMBER_VALUES),
            _fn_arg("high", 3, _NUMBER_VALUES),
        ],
        3, 3, "boolean",
        "Все значения преобразуются в число; границы включены.",
        [_literal(15), _literal(10), _literal(20)],
    ),
    _fn(
        "now", "Возвращает текущее время UTC строкой HH:MM:SS.",
        [], 0, 0, "string",
        "Аргументы запрещены; результат — время UTC без даты.", [],
    ),
    _fn(
        "today", "Возвращает текущую дату UTC строкой YYYY-MM-DD.",
        [], 0, 0, "string",
        "Аргументы запрещены; результат — дата UTC.", [],
    ),
    _fn(
        "if", "Выбирает одно из двух значений по условию.",
        [
            _fn_arg("condition", 1, _ANY_VALUES),
            _fn_arg("then", 2, _ANY_VALUES),
            _fn_arg("else", 3, _ANY_VALUES),
        ],
        3, 3, "тип выбранной ветви",
        "Ровно 3 аргумента. Условие приводится к bool; вычисляется только "
        "выбранная ветвь.",
        [_literal(True), _literal("yes"), _literal("no")],
        lazy=True,
    ),
    _fn(
        "coalesce", "Возвращает первое значение, отличное от null.",
        [_fn_arg("values", "1..N", _ANY_VALUES, required=False)],
        0, None, "тип первого не-null значения или null",
        "Принимает любое число аргументов; вычисляет последовательно и "
        "прекращает на первом не-null. Без аргументов возвращает null.",
        [_literal(None, "string"), _literal("fallback")],
        lazy=True,
    ),
]


EXPRESSION_CAPABILITIES: dict[str, Any] = {
    "types": {
        "binary": {
            "id": "binary",
            "name": "Бинарное выражение",
            "description": "Применяет бинарный оператор к двум вычисляемым аргументам.",
            "json_shape": {"type": "binary", "op": "BinaryOp", "left": "ExpressionArg", "right": "ExpressionArg"},
            "required_fields": ["type", "op", "left", "right"],
            "optional_fields": [],
            "argument_types": _ARG_TYPES,
            "example_json": _BINARY_OPERATORS[6]["example_json"],
        },
        "unary": {
            "id": "unary",
            "name": "Унарное выражение",
            "description": "Применяет унарный оператор к одному вычисляемому аргументу.",
            "json_shape": {"type": "unary", "op": "UnaryOp", "operand": "ExpressionArg"},
            "required_fields": ["type", "op", "operand"],
            "optional_fields": [],
            "argument_types": _ARG_TYPES,
            "example_json": _UNARY_OPERATORS[0]["example_json"],
        },
        "call": {
            "id": "call",
            "name": "Вызов функции",
            "description": "Вычисляет функцию по имени fn с массивом ExpressionArg.",
            "json_shape": {"type": "call", "fn": "string", "args": "ExpressionArg[]"},
            "required_fields": ["type", "fn"],
            "optional_fields": ["args"],
            "argument_types": _ARG_TYPES,
            "example_json": _FUNCTIONS[0]["example_json"],
        },
        "group": {
            "id": "group",
            "name": "Групповое выражение",
            "description": "Выполняет n-арную логическую или арифметическую операцию по массиву аргументов.",
            "json_shape": {"type": "group", "op": "GroupOp", "items": "ExpressionArg[]"},
            "required_fields": ["type", "op"],
            "optional_fields": ["items"],
            "argument_types": _ARG_TYPES,
            "example_json": _GROUP_OPERATORS[0]["example_json"],
        },
    },
    "operators": {
        "binary": _BINARY_OPERATORS,
        "unary": _UNARY_OPERATORS,
        "group": _GROUP_OPERATORS,
    },
    "functions": _FUNCTIONS,
    "argument_types": {
        "literal": {
            "id": "literal",
            "description": "Константа. data_type выводится для bool, number и string, если не указан явно.",
            "format": {
                "type": "literal",
                "value": "number|string|boolean|null",
                "data_type": "number|string|boolean|time|duration|path",
            },
            "required_fields": ["type"],
            "optional_fields": ["value", "data_type"],
            "validation": "value=null требует явный data_type; заданный data_type проверяется по типу value. time/duration сохраняются в JSON строками и преобразуются при вычислении.",
            "example_json": _literal("22:30", "time"),
        },
        "ref": {
            "id": "ref",
            "description": "Ссылка на выражение в AutomationSchema.expressions.",
            "format": {"type": "ref", "ref": "expression id"},
            "required_fields": ["type", "ref"],
            "optional_fields": [],
            "validation": "Для вычисления нужен AutomationContext; отсутствующая ссылка и циклические ссылки приводят к ExpressionError.",
            "example_json": {"type": "ref", "ref": "threshold"},
        },
        "path": {
            "id": "path",
            "description": "Доступ к полю устройства, комнаты, системному значению или параметру сценария.",
            "format": {"type": "path", "path": "device.<system_name>.<field_id>|room.<room>.<device_type>.<field>|system.<field>|variable.<name>"},
            "required_fields": ["type", "path"],
            "optional_fields": [],
            "validation": "device-пути требуют существующее устройство и поле; room-пути требуют существующую комнату и поле; system поддерживает time, hour_minute, date, weekday, timestamp, utc_offset; variable ищется в AutomationContext, ссылки на device, room, system и другие variable разрешаются рекурсивно с защитой от циклов.",
            "example_json": {"type": "path", "path": "system.time"},
        },
    },
}


def get_expression_capabilities() -> dict[str, Any]:
    """Return a detached copy so callers cannot mutate the shared catalog."""
    from copy import deepcopy

    return deepcopy(EXPRESSION_CAPABILITIES)
