# app/core/entities/automation/blocks/expression.py
"""
Резолвер выражений (AST) → рантайм-значение.

Поддерживаемые узлы:
  BinaryExpr   — сравнение, арифметика, concat, before/after
  UnaryExpr    — not, neg
  CallExpr     — вызов функции (min, max, if, between, ...)
  GroupExpr    — n-арные and / or / add / mul (с коротким замыканием для and/or)

Публичная точка входа: evaluate_expr(expr, ctx).
"""
from __future__ import annotations

import math
from datetime import date, datetime, time, timedelta, timezone
from typing import Any, Callable

from app.schemas.automation.automation_v4 import (
    Expression,
    BinaryExpr,
    UnaryExpr,
    CallExpr,
    GroupExpr,
    ExpressionArg,
    LiteralArg,
)
from app.core.entities.automation.automation_context import AutomationContext
from app.core.entities.automation.blocks.expression_arg import (
    resolve_arg
)
from app.pkg.logger import get_automatization

logger = get_automatization.get_logger(__name__)


# ============================================================
# Ошибки
# ============================================================

class ExpressionError(Exception):
    """Ошибка вычисления выражения — с человекочитаемым сообщением."""


# ============================================================
# Приведение типов
# ============================================================

def _to_number(value: Any) -> int | float:
    """Приводит значение к int / float. Бросает TypeError, если не получается."""
    if isinstance(value, bool):
        return int(value)
    if isinstance(value, (int, float)):
        return value
    if isinstance(value, str):
        s = value.strip()
        try:
            if "." in s or "e" in s.lower():
                return float(s)
            return int(s)
        except (ValueError, TypeError):
            pass
    raise TypeError(f"Не удалось привести к числу: {value!r}")


def _to_bool(value: Any) -> bool:
    """Приводит значение к bool с разумной семантикой."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        s = value.strip().lower()
        if s in ("true", "1", "on", "yes"):
            return True
        if s in ("false", "0", "off", "no", ""):
            return False
    return bool(value)


def _to_time(value: Any) -> time:
    """Приводит значение к time для before/after."""
    if isinstance(value, time):
        return value
    if isinstance(value, datetime):
        return value.time()
    if isinstance(value, str):
        return time.fromisoformat(value)
    raise TypeError(f"Не удалось привести к time: {value!r}")


# ============================================================
# Операции
# ============================================================

def _equal(a: Any, b: Any) -> bool:
    """
    Равенство с числовым приведением.
    "25" == 25 → True (частая ситуация с MQTT-строками).
    """
    if type(a) is type(b):
        return a == b
    try:
        return _to_number(a) == _to_number(b)
    except (TypeError, ValueError):
        return a == b


def _compare(op: str, left: Any, right: Any) -> bool:
    """lt / lte / gt / gte — с числовым приведением."""
    l = _to_number(left)
    r = _to_number(right)

    if op == "lt":
        return l < r
    if op == "lte":
        return l <= r
    if op == "gt":
        return l > r
    if op == "gte":
        return l >= r
    raise ExpressionError(f"Неизвестный оператор сравнения: {op!r}")


def _arith(op: str, left: Any, right: Any) -> int | float:
    """add / sub / mul / div / mod / pow — с числовым приведением."""
    l = _to_number(left)
    r = _to_number(right)

    if op == "add":
        return l + r
    if op == "sub":
        return l - r
    if op == "mul":
        return l * r
    if op == "div":
        if r == 0:
            raise ExpressionError("Деление на ноль")
        return l / r
    if op == "mod":
        if r == 0:
            raise ExpressionError("Деление по модулю на ноль")
        return l % r
    if op == "pow":
        return l ** r
    raise ExpressionError(f"Неизвестный арифметический оператор: {op!r}")


def _apply_binary(op: str, left: Any, right: Any) -> Any:
    if op == "eq":
        return _equal(left, right)
    if op == "ne":
        return not _equal(left, right)
    if op in ("lt", "lte", "gt", "gte"):
        return _compare(op, left, right)
    if op in ("add", "sub", "mul", "div", "mod", "pow"):
        return _arith(op, left, right)
    if op == "concat":
        return f"{left}{right}"
    if op == "before":
        return _to_time(left) < _to_time(right)
    if op == "after":
        return _to_time(left) > _to_time(right)
    raise ExpressionError(f"Неизвестный бинарный оператор: {op!r}")


def _apply_unary(op: str, value: Any) -> Any:
    if op == "not":
        return not _to_bool(value)
    if op == "neg":
        return -_to_number(value)
    raise ExpressionError(f"Неизвестный унарный оператор: {op!r}")


# ============================================================
# Функции
# ============================================================

def _fn_min(*args: Any) -> Any:
    return min(_to_number(a) for a in args)


def _fn_max(*args: Any) -> Any:
    return max(_to_number(a) for a in args)


def _fn_abs(value: Any) -> Any:
    return abs(_to_number(value))


def _fn_round(value: Any, ndigits: Any = 0) -> Any:
    return round(_to_number(value), int(_to_number(ndigits)))


def _fn_floor(value: Any) -> int:
    return math.floor(_to_number(value))


def _fn_ceil(value: Any) -> int:
    return math.ceil(_to_number(value))


def _fn_int(value: Any) -> int:
    return int(_to_number(value))


def _fn_float(value: Any) -> float:
    return float(_to_number(value))


def _fn_str(value: Any) -> str:
    return str(value)


def _fn_bool(value: Any) -> bool:
    return _to_bool(value)


def _fn_len(value: Any) -> int:
    if isinstance(value, (str, list, tuple, dict)):
        return len(value)
    raise ExpressionError(f"len: не поддерживается тип {type(value).__name__}")


def _fn_lower(value: Any) -> str:
    return str(value).lower()


def _fn_upper(value: Any) -> str:
    return str(value).upper()


def _fn_contains(haystack: Any, needle: Any) -> bool:
    return str(needle) in str(haystack)


def _fn_startswith(value: Any, prefix: Any) -> bool:
    return str(value).startswith(str(prefix))


def _fn_endswith(value: Any, suffix: Any) -> bool:
    return str(value).endswith(str(suffix))


def _fn_between(value: Any, low: Any, high: Any) -> bool:
    """value между low и high включительно."""
    v = _to_number(value)
    lo = _to_number(low)
    hi = _to_number(high)
    return lo <= v <= hi


def _fn_now() -> str:
    return datetime.now(timezone.utc).strftime("%H:%M:%S")


def _fn_today() -> str:
    return datetime.now(timezone.utc).date().isoformat()


_FUNCTIONS: dict[str, Callable[..., Any]] = {
    "min": _fn_min,
    "max": _fn_max,
    "abs": _fn_abs,
    "round": _fn_round,
    "floor": _fn_floor,
    "ceil": _fn_ceil,
    "int": _fn_int,
    "float": _fn_float,
    "str": _fn_str,
    "bool": _fn_bool,
    "len": _fn_len,
    "lower": _fn_lower,
    "upper": _fn_upper,
    "contains": _fn_contains,
    "startswith": _fn_startswith,
    "endswith": _fn_endswith,
    "between": _fn_between,
    "now": _fn_now,
    "today": _fn_today,
}


# ============================================================
# Ленивые функции (не вычисляют все аргументы)
# ============================================================

def _lazy_if(args: list[ExpressionArg], ctx: AutomationContext) -> Any:
    """
    if(cond, then, else) — вычисляет только нужную ветку.
    Позволяет писать if(x != 0, 1/x, 0) без падения на x=0.
    """
    if len(args) != 3:
        raise ExpressionError(f"if() ожидает 3 аргумента, получил {len(args)}")
    cond = _to_bool(resolve_arg(args[0], ctx))
    return resolve_arg(args[1] if cond else args[2], ctx)


def _lazy_coalesce(args: list[ExpressionArg], ctx: AutomationContext) -> Any:
    """coalesce(a, b, c) — первое не-None значение. Лениво."""
    for a in args:
        v = resolve_arg(a, ctx)
        if v is not None:
            return v
    return None


_LAZY_FUNCTIONS: dict[str, Callable[[list[ExpressionArg], AutomationContext], Any]] = {
    "if": _lazy_if,
    "coalesce": _lazy_coalesce,
}


# ============================================================
# Публичные функции вычисления
# ============================================================

def evaluate_expr(expr: Expression, ctx: AutomationContext) -> Any:
    """Вычисляет Expression и возвращает рантайм-значение."""
    if isinstance(expr, BinaryExpr):
        left = resolve_arg(expr.left, ctx)
        right = resolve_arg(expr.right, ctx)
        return _apply_binary(expr.op, left, right)

    if isinstance(expr, UnaryExpr):
        operand = resolve_arg(expr.operand, ctx)
        return _apply_unary(expr.op, operand)

    if isinstance(expr, CallExpr):
        return _evaluate_call(expr, ctx)

    if isinstance(expr, GroupExpr):
        return _evaluate_group(expr, ctx)

    raise ExpressionError(f"Неизвестный тип выражения: {type(expr).__name__}")


def _evaluate_call(expr: CallExpr, ctx: AutomationContext) -> Any:
    fn = expr.fn

    # Ленивые функции получают сырые args + ctx
    lazy = _LAZY_FUNCTIONS.get(fn)
    if lazy is not None:
        return lazy(expr.args, ctx)

    # Обычные функции: вычисляем все args и передаём значения
    eager = _FUNCTIONS.get(fn)
    if eager is None:
        raise ExpressionError(f"Неизвестная функция: {fn!r}")

    values = [resolve_arg(a, ctx) for a in expr.args]
    try:
        return eager(*values)
    except ExpressionError:
        raise
    except Exception as e:
        raise ExpressionError(f"{fn}() упал: {e}") from e


def _evaluate_group(expr: GroupExpr, ctx: AutomationContext) -> Any:
    op = expr.op

    if op == "and":
        for item in expr.items:
            if not _to_bool(resolve_arg(item, ctx)):
                return False
        return True

    if op == "or":
        for item in expr.items:
            if _to_bool(resolve_arg(item, ctx)):
                return True
        return False

    if op == "add":
        total: Any = 0
        for item in expr.items:
            total = _arith("add", total, resolve_arg(item, ctx))
        return total

    if op == "mul":
        total: Any = 1
        for item in expr.items:
            total = _arith("mul", total, resolve_arg(item, ctx))
        return total

    raise ExpressionError(f"Неизвестная групповая операция: {op!r}")