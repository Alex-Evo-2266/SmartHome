# tests/automation/test_expression.py
"""
Тесты для app.core.entities.automation.blocks.expression.evaluate_expr.

Покрытие:
  - BinaryExpr: eq, ne, lt, lte, gt, gte, add, sub, mul, div, mod, pow,
                concat, before, after
  - UnaryExpr:  not, neg
  - GroupExpr:  and (замыкание), or (замыкание), add, mul
  - CallExpr:   eager-функции + lazy if / coalesce
  - Ошибки:     деление на ноль, неизвестная функция, неизвестный оператор
  - Типы:       числовое приведение в eq/сравнениях/арифметике
"""
from __future__ import annotations

from datetime import time

import pytest

from app.schemas.automation.automation_v4 import (
    BinaryExpr, UnaryExpr, CallExpr, GroupExpr,
    LiteralArg, RefArg, PathArg, BinaryOp, UnaryOp, GroupOp, AutomationSchema, ConditionStep
)
from app.core.entities.automation.blocks.expression import (
    evaluate_expr, ExpressionError,
)
from app.core.entities.automation.blocks.expression_arg import (
    resolve_arg, AutomationContext,
)

# ============================================================
# Хелперы — конструкторы узлов
# ============================================================

def lit(value, data_type=None) -> LiteralArg:
    return LiteralArg(type="literal", value=value, data_type=data_type)


def binary(op: BinaryOp, left, right) -> BinaryExpr:
    return BinaryExpr(type="binary", op=op, left=left, right=right)


def unary(op: UnaryOp, operand) -> UnaryExpr:
    return UnaryExpr(type="unary", op=op, operand=operand)


def call(fn: str, *args) -> CallExpr:
    return CallExpr(type="call", fn=fn, args=list(args))


def group(op: GroupOp, *items) -> GroupExpr:
    return GroupExpr(type="group", op=op, items=list(items))

def ref(name: str) -> RefArg:
    return RefArg(type="ref", ref=name)


def make_automation(expressions: dict) -> AutomationSchema:
    return AutomationSchema(
        id="s1",
        name="test",
        entry="step_1",
        steps={"step_1": ConditionStep(type="condition", condition=lit(True))},               # для тестов evaluate_ref шаги не нужны
        expressions=expressions,
    )

@pytest.fixture
def ctx() -> AutomationContext:
    exprs = {"v_a": binary(op=BinaryOp.ADD, left=lit(3), right=lit(2)) }
    return AutomationContext(make_automation(exprs))


# ============================================================
# BinaryExpr — сравнения
# ============================================================

class TestBinaryEquality:

    def test_eq_numbers(self, ctx):
        assert evaluate_expr(binary(BinaryOp.EQ, lit(5), lit(5)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.EQ, lit(5), lit(6)), ctx) is False

    def test_eq_strings(self, ctx):
        assert evaluate_expr(binary(BinaryOp.EQ, lit("open"), lit("open")), ctx) is True
        assert evaluate_expr(binary(BinaryOp.EQ, lit("open"), lit("closed")), ctx) is False

    def test_eq_string_to_number(self, ctx):
        # числовое приведение: "25" == 25 → True
        assert evaluate_expr(binary(BinaryOp.EQ, lit("25"), lit(25)), ctx) is True

    def test_eq_string_to_number_negative(self, ctx):
        assert evaluate_expr(binary(BinaryOp.EQ, lit("25"), lit(26)), ctx) is False

    def test_eq_non_numeric_string_vs_number(self, ctx):
        # "abc" не приводится к числу → обычное сравнение → False
        assert evaluate_expr(binary(BinaryOp.EQ, lit("abc"), lit(25)), ctx) is False

    def test_eq_bool(self, ctx):
        assert evaluate_expr(binary(BinaryOp.EQ, lit(True), lit(True)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.EQ, lit(True), lit(False)), ctx) is False

    def test_eq_none(self, ctx):
        assert evaluate_expr(
            binary(BinaryOp.EQ, lit(None, "string"), lit(None, "string")), ctx
        ) is True

    def test_ne(self, ctx):
        assert evaluate_expr(binary(BinaryOp.NE, lit(5), lit(6)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.NE, lit(5), lit(5)), ctx) is False

    def test_ne_string_number(self, ctx):
        assert evaluate_expr(binary(BinaryOp.NE, lit("25"), lit(26)), ctx) is True


class TestBinaryComparison:

    def test_lt(self, ctx):
        assert evaluate_expr(binary(BinaryOp.LT, lit(5), lit(10)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.LT, lit(10), lit(10)), ctx) is False

    def test_lte(self, ctx):
        assert evaluate_expr(binary(BinaryOp.LTE, lit(10), lit(10)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.LTE, lit(11), lit(10)), ctx) is False

    def test_gt(self, ctx):
        assert evaluate_expr(binary(BinaryOp.GT, lit(10), lit(5)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.GT, lit(5), lit(5)), ctx) is False

    def test_gte(self, ctx):
        assert evaluate_expr(binary(BinaryOp.GTE, lit(10), lit(10)), ctx) is True
        assert evaluate_expr(binary(BinaryOp.GTE, lit(5), lit(10)), ctx) is False

    def test_comparison_with_string_number(self, ctx):
        # "15" > 10 — приводится к числу
        assert evaluate_expr(binary(BinaryOp.GT, lit("15"), lit(10)), ctx) is True

    def test_comparison_non_numeric_raises(self, ctx):
        with pytest.raises(ExpressionError) if False else pytest.raises(TypeError):
            evaluate_expr(binary(BinaryOp.GT, lit("abc"), lit(10)), ctx)


class TestBinaryArithmetic:

    def test_add(self, ctx):
        assert evaluate_expr(binary(BinaryOp.ADD, lit(5), lit(3)), ctx) == 8

    def test_add_with_string_number(self, ctx):
        assert evaluate_expr(binary(BinaryOp.ADD, lit("5"), lit(3)), ctx) == 8

    def test_sub(self, ctx):
        assert evaluate_expr(binary(BinaryOp.SUB, lit(10), lit(3)), ctx) == 7

    def test_mul(self, ctx):
        assert evaluate_expr(binary(BinaryOp.MUL, lit(4), lit(5)), ctx) == 20

    def test_div(self, ctx):
        assert evaluate_expr(binary(BinaryOp.DIV, lit(10), lit(2)), ctx) == 5

    def test_div_returns_float(self, ctx):
        assert evaluate_expr(binary(BinaryOp.DIV, lit(10), lit(4)), ctx) == 2.5

    def test_div_by_zero_raises(self, ctx):
        with pytest.raises(ExpressionError, match="Деление на ноль"):
            evaluate_expr(binary(BinaryOp.DIV, lit(10), lit(0)), ctx)

    def test_mod(self, ctx):
        assert evaluate_expr(binary(BinaryOp.MOD, lit(10), lit(3)), ctx) == 1

    def test_mod_by_zero_raises(self, ctx):
        with pytest.raises(ExpressionError, match="Деление по модулю"):
            evaluate_expr(binary(BinaryOp.MOD, lit(10), lit(0)), ctx)

    def test_pow(self, ctx):
        assert evaluate_expr(binary(BinaryOp.POW, lit(2), lit(10)), ctx) == 1024

    def test_add_non_numeric_raises(self, ctx):
        with pytest.raises(TypeError):
            evaluate_expr(binary(BinaryOp.ADD, lit("abc"), lit(1)), ctx)


class TestBinaryString:

    def test_concat(self, ctx):
        assert evaluate_expr(
            binary(BinaryOp.CONCAT, lit("Hello, "), lit("world")), ctx
        ) == "Hello, world"

    def test_concat_with_numbers(self, ctx):
        # concat приводит к строке, не к числу
        assert evaluate_expr(binary(BinaryOp.CONCAT, lit(5), lit(3)), ctx) == "53"

    def test_concat_mixed(self, ctx):
        assert evaluate_expr(
            binary(BinaryOp.CONCAT, lit("id_"), lit(42)), ctx
        ) == "id_42"


class TestBinaryTime:

    def test_before_true(self, ctx):
        left = lit("08:00", "time")
        right = lit("22:00", "time")
        assert evaluate_expr(binary(BinaryOp.BEFORE, left, right), ctx) is True

    def test_before_false(self, ctx):
        left = lit("23:00", "time")
        right = lit("22:00", "time")
        assert evaluate_expr(binary(BinaryOp.BEFORE, left, right), ctx) is False

    def test_after_true(self, ctx):
        left = lit("23:00", "time")
        right = lit("22:00", "time")
        assert evaluate_expr(binary(BinaryOp.AFTER, left, right), ctx) is True

    def test_after_false(self, ctx):
        left = lit("08:00", "time")
        right = lit("22:00", "time")
        assert evaluate_expr(binary(BinaryOp.AFTER, left, right), ctx) is False

    def test_before_equal_is_false(self, ctx):
        left = lit("22:00", "time")
        right = lit("22:00", "time")
        assert evaluate_expr(binary(BinaryOp.BEFORE, left, right), ctx) is False
        assert evaluate_expr(binary(BinaryOp.AFTER, left, right), ctx) is False


# ============================================================
# UnaryExpr
# ============================================================

class TestUnary:

    def test_not_true(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NOT, lit(True)), ctx) is False

    def test_not_false(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NOT, lit(False)), ctx) is True

    def test_not_number(self, ctx):
        # 0 → False, 1 → True
        assert evaluate_expr(unary(UnaryOp.NOT, lit(0)), ctx) is True
        assert evaluate_expr(unary(UnaryOp.NOT, lit(5)), ctx) is False

    def test_not_string(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NOT, lit("true")), ctx) is False
        assert evaluate_expr(unary(UnaryOp.NOT, lit("false")), ctx) is True
        assert evaluate_expr(unary(UnaryOp.NOT, lit("")), ctx) is True

    def test_neg_number(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NEG, lit(5)), ctx) == -5

    def test_neg_float(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NEG, lit(3.14)), ctx) == -3.14

    def test_neg_string_number(self, ctx):
        assert evaluate_expr(unary(UnaryOp.NEG, lit("5")), ctx) == -5


# ============================================================
# GroupExpr
# ============================================================

class TestGroupLogical:

    def test_and_all_true(self, ctx):
        assert evaluate_expr(
            group(GroupOp.AND, lit(True), lit(True), lit(True)), ctx
        ) is True

    def test_and_one_false(self, ctx):
        assert evaluate_expr(
            group(GroupOp.AND, lit(True), lit(False), lit(True)), ctx
        ) is False

    def test_and_empty_is_true(self, ctx):
        # По математической логике — пустое И = True
        assert evaluate_expr(group(GroupOp.AND), ctx) is True

    def test_and_short_circuits(self, ctx):
        # Ссылка на RefArg — упадёт, если не закоротит
        items = [
            lit(False),
            RefArg(type="ref", ref="should_not_be_evaluated"),
        ]
        assert evaluate_expr(group(GroupOp.AND, *items), ctx) is False

    def test_or_all_false(self, ctx):
        assert evaluate_expr(
            group(GroupOp.OR, lit(False), lit(False)), ctx
        ) is False

    def test_or_one_true(self, ctx):
        assert evaluate_expr(
            group(GroupOp.OR, lit(False), lit(True)), ctx
        ) is True

    def test_or_empty_is_false(self, ctx):
        assert evaluate_expr(group(GroupOp.OR), ctx) is False

    def test_or_short_circuits(self, ctx):
        items = [
            lit(True),
            RefArg(type="ref", ref="should_not_be_evaluated"),
        ]
        assert evaluate_expr(group(GroupOp.OR, *items), ctx) is True


class TestGroupArithmetic:

    def test_add_sum(self, ctx):
        assert evaluate_expr(
            group(GroupOp.ADD, lit(1), lit(2), lit(3), lit(4)), ctx
        ) == 10

    def test_add_empty_is_zero(self, ctx):
        assert evaluate_expr(group(GroupOp.ADD), ctx) == 0

    def test_add_with_strings(self, ctx):
        assert evaluate_expr(
            group(GroupOp.ADD, lit("1"), lit(2), lit("3")), ctx
        ) == 6

    def test_mul_product(self, ctx):
        assert evaluate_expr(
            group(GroupOp.MUL, lit(2), lit(3), lit(4)), ctx
        ) == 24

    def test_mul_empty_is_one(self, ctx):
        assert evaluate_expr(group(GroupOp.MUL), ctx) == 1

    def test_mul_one_zero(self, ctx):
        assert evaluate_expr(
            group(GroupOp.MUL, lit(2), lit(0), lit(4)), ctx
        ) == 0


# ============================================================
# CallExpr — eager функции
# ============================================================

class TestCallMath:

    def test_min(self, ctx):
        assert evaluate_expr(call("min", lit(5), lit(3), lit(7)), ctx) == 3

    def test_max(self, ctx):
        assert evaluate_expr(call("max", lit(5), lit(3), lit(7)), ctx) == 7

    def test_min_with_strings(self, ctx):
        assert evaluate_expr(call("min", lit("5"), lit(3)), ctx) == 3

    def test_abs(self, ctx):
        assert evaluate_expr(call("abs", lit(-5)), ctx) == 5

    def test_round_default(self, ctx):
        assert evaluate_expr(call("round", lit(3.7)), ctx) == 4

    def test_round_with_digits(self, ctx):
        assert evaluate_expr(call("round", lit(3.14159), lit(2)), ctx) == 3.14

    def test_floor(self, ctx):
        assert evaluate_expr(call("floor", lit(3.9)), ctx) == 3

    def test_ceil(self, ctx):
        assert evaluate_expr(call("ceil", lit(3.1)), ctx) == 4

    def test_int(self, ctx):
        assert evaluate_expr(call("int", lit("42")), ctx) == 42

    def test_float(self, ctx):
        assert evaluate_expr(call("float", lit("3.14")), ctx) == 3.14

    def test_between_inside(self, ctx):
        assert evaluate_expr(
            call("between", lit(15), lit(10), lit(20)), ctx
        ) is True

    def test_between_boundary(self, ctx):
        assert evaluate_expr(
            call("between", lit(10), lit(10), lit(20)), ctx
        ) is True

    def test_between_outside(self, ctx):
        assert evaluate_expr(
            call("between", lit(25), lit(10), lit(20)), ctx
        ) is False


class TestCallString:

    def test_str(self, ctx):
        assert evaluate_expr(call("str", lit(42)), ctx) == "42"

    def test_len(self, ctx):
        assert evaluate_expr(call("len", lit("hello")), ctx) == 5

    def test_lower(self, ctx):
        assert evaluate_expr(call("lower", lit("Hello")), ctx) == "hello"

    def test_upper(self, ctx):
        assert evaluate_expr(call("upper", lit("hello")), ctx) == "HELLO"

    def test_contains_true(self, ctx):
        assert evaluate_expr(
            call("contains", lit("hello world"), lit("world")), ctx
        ) is True

    def test_contains_false(self, ctx):
        assert evaluate_expr(
            call("contains", lit("hello"), lit("world")), ctx
        ) is False

    def test_startswith(self, ctx):
        assert evaluate_expr(
            call("startswith", lit("hello"), lit("he")), ctx
        ) is True

    def test_endswith(self, ctx):
        assert evaluate_expr(
            call("endswith", lit("hello"), lit("lo")), ctx
        ) is True

    def test_bool_string_true(self, ctx):
        assert evaluate_expr(call("bool", lit("true")), ctx) is True

    def test_bool_string_false(self, ctx):
        assert evaluate_expr(call("bool", lit("false")), ctx) is False


class TestCallSystem:

    def test_now_format(self, ctx):
        result = evaluate_expr(call("now"), ctx)
        assert isinstance(result, str)
        # "HH:MM:SS"
        assert len(result) == 8
        assert result[2] == ":" and result[5] == ":"

    def test_today_format(self, ctx):
        result = evaluate_expr(call("today"), ctx)
        assert isinstance(result, str)
        # "YYYY-MM-DD"
        assert len(result) == 10
        assert result[4] == "-" and result[7] == "-"


# ============================================================
# CallExpr — lazy функции
# ============================================================

class TestCallLazyIf:

    def test_if_true_branch(self, ctx):
        expr = call("if", lit(True), lit(10), lit(20))
        assert evaluate_expr(expr, ctx) == 10

    def test_if_false_branch(self, ctx):
        expr = call("if", lit(False), lit(10), lit(20))
        assert evaluate_expr(expr, ctx) == 20

    def test_if_lazy_true(self, ctx):
        # RefArg в false-ветке не должен вычисляться
        expr = call(
            "if",
            lit(True),
            lit("ok"),
            RefArg(type="ref", ref="would_fail"),
        )
        assert evaluate_expr(expr, ctx) == "ok"

    def test_if_lazy_false(self, ctx):
        expr = call(
            "if",
            lit(False),
            RefArg(type="ref", ref="would_fail"),
            lit("ok"),
        )
        assert evaluate_expr(expr, ctx) == "ok"

    def test_if_requires_three_args(self, ctx):
        with pytest.raises(ExpressionError, match="3 аргумента"):
            evaluate_expr(call("if", lit(True), lit(1)), ctx)

    def test_if_condition_truthy(self, ctx):
        # 1 → True
        expr = call("if", lit(1), lit("yes"), lit("no"))
        assert evaluate_expr(expr, ctx) == "yes"

    def test_if_condition_falsy(self, ctx):
        # 0 → False
        expr = call("if", lit(0), lit("yes"), lit("no"))
        assert evaluate_expr(expr, ctx) == "no"


class TestCallLazyCoalesce:

    def test_coalesce_first_not_none(self, ctx):
        expr = call("coalesce", lit(None, "string"), lit(5), lit(10))
        assert evaluate_expr(expr, ctx) == 5

    def test_coalesce_all_not_none(self, ctx):
        expr = call("coalesce", lit(1), lit(2))
        assert evaluate_expr(expr, ctx) == 1

    def test_coalesce_all_none(self, ctx):
        expr = call(
            "coalesce",
            lit(None, "string"),
            lit(None, "string"),
        )
        assert evaluate_expr(expr, ctx) is None

    def test_coalesce_empty(self, ctx):
        expr = call("coalesce")
        assert evaluate_expr(expr, ctx) is None


# ============================================================
# Ошибки
# ============================================================

class TestErrors:

    def test_unknown_function(self, ctx):
        with pytest.raises(ExpressionError, match="Неизвестная функция"):
            evaluate_expr(call("nonexistent", lit(1)), ctx)

    def test_function_raises_wrapped(self, ctx):
        # len у числа не поддерживается → ExpressionError с контекстом
        with pytest.raises(ExpressionError, match="len: не поддерживается тип int"):
            evaluate_expr(call("len", lit(42)), ctx)

    def test_unknown_binary_op(self, ctx):
        expr = BinaryExpr(
            type="binary",
            op=BinaryOp.EQ,  # валидное, но подменим вручную
            left=lit(1), right=lit(2),
        )
        object.__setattr__(expr, "op", "wat")
        with pytest.raises(ExpressionError, match="Неизвестный бинарный"):
            evaluate_expr(expr, ctx)

    def test_unknown_unary_op(self, ctx):
        expr = UnaryExpr(type="unary", op=UnaryOp.NOT, operand=lit(1))
        object.__setattr__(expr, "op", "wat")
        with pytest.raises(ExpressionError, match="Неизвестный унарный"):
            evaluate_expr(expr, ctx)

    def test_unknown_group_op(self, ctx):
        expr = GroupExpr(type="group", op=GroupOp.AND, items=[lit(1)])
        object.__setattr__(expr, "op", "wat")
        with pytest.raises(ExpressionError, match="Неизвестная групповая"):
            evaluate_expr(expr, ctx)


# ============================================================
# Интеграционные — вложенные выражения
# ============================================================

class TestNested:

    def test_arith_in_comparison(self, ctx):
        # (5 + 3) > 7
        ctx.set_expression("e_l", binary(BinaryOp.ADD, lit(5), lit(3)))
        left = ref("e_l")
        right = lit(7)
        expr = binary(BinaryOp.GT, left, right)
        assert evaluate_expr(expr, ctx) is True

    def test_nested_group_and(self, ctx):
        # (a > 0) AND (b < 100)
        ctx.set_expression("e_l2", binary(BinaryOp.GT, lit(5), lit(0)))
        ctx.set_expression("e_r2", binary(BinaryOp.LT, lit(50), lit(100)))
        cond1 = ref("e_l2")
        cond2 = ref("e_r2")
        expr = group(GroupOp.AND, cond1, cond2)
        assert evaluate_expr(expr, ctx) is True

    def test_if_with_comparison(self, ctx):
        # if(x > 5, "big", "small")
        ctx.set_expression("if_cond", binary(BinaryOp.GT, lit(10), lit(5)))
        cond = ref("if_cond")
        expr = call("if", cond, lit("big"), lit("small"))
        assert evaluate_expr(expr, ctx) == "big"

    def test_min_of_add(self, ctx):
        # min(5 + 3, 10)
        ctx.set_expression("min_cond", binary(BinaryOp.ADD, lit(5), lit(3)))
        sum_expr = ref("min_cond")
        expr = call("min", sum_expr, lit(10))
        assert evaluate_expr(expr, ctx) == 8

    def test_deeply_nested(self, ctx):
        # ((2 + 3) * (4 + 5)) == 45

        ctx.set_expression("f2", binary(BinaryOp.ADD, lit(2), lit(3)))
        ctx.set_expression("f3", binary(BinaryOp.ADD, lit(4), lit(5)))
        left = ref("f2")
        right = ref("f3")
        ctx.set_expression("f4", binary(BinaryOp.MUL, left, right))
        product = ref("f4")
        expr = binary(BinaryOp.EQ, product, lit(45))
        assert evaluate_expr(expr, ctx) is True

    def test_complex_logic(self, ctx):
        # (temp > 20) AND (time before "22:00")
        ctx.set_expression("f5", binary(BinaryOp.GT, lit(25), lit(20)))
        ctx.set_expression("f6", binary(BinaryOp.BEFORE, lit("10:00", "time"), lit("22:00", "time")))
        cond1 = ref("f5")
        cond2 = ref("f6")
        expr = group(GroupOp.AND, cond1, cond2)
        assert evaluate_expr(expr, ctx) is True


# ============================================================
# Синергия с EvalContext
# ============================================================

class TestEvalContextIntegration:

    def test_literal_does_not_use_context(self, ctx):
        # LiteralArg не должен попадать в кэш ctx
        evaluate_expr(binary(BinaryOp.EQ, lit(5), lit(5)), ctx)
        assert len(ctx) == 0

    def test_path_cached_in_expression(self, monkeypatch):
        """Один и тот же PathArg в одном выражении резолвится один раз."""
        import app.core.entities.automation.automation_context as ea

        calls: list[str] = []
        monkeypatch.setattr(
            ea, "resolve_path",
            lambda arg: calls.append(arg.path) or 10,
        )

        ctx = AutomationContext(make_automation({})) 

        path = PathArg(type="path", path="device.temp.value")
        # (device.temp.value > 5) AND (device.temp.value < 20)

        ctx.set_expression("f8", binary(BinaryOp.GT, path, lit(5)))
        ctx.set_expression("f9", binary(BinaryOp.LT, path, lit(20)))
        cond1 = ref("f8")
        cond2 = ref("f9")
        expr = group(GroupOp.AND, cond1, cond2)

        assert evaluate_expr(expr, ctx) is True
        assert len(calls) == 1        # стор дёрнулся один раз