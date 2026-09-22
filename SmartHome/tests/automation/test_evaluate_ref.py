# tests/automation/test_evaluate_ref.py
import pytest

from app.schemas.automation.automation_v4 import (
    LiteralArg, BinaryExpr, BinaryOp, RefArg,
    AutomationSchema, BinaryExpr, ConditionStep
)
from app.core.entities.automation.automation_context import (
    AutomationContext, ExpressionError,
)
from app.core.entities.automation.blocks.expression import evaluate_expr
from app.core.entities.automation.blocks.evaluate_ref import evaluate_ref


def lit(v, dt=None) -> LiteralArg:
    return LiteralArg(type="literal", value=v, data_type=dt)


def ref(name: str) -> RefArg:
    return RefArg(type="ref", ref=name)


def binary(op: BinaryOp, left, right) -> BinaryExpr:
    return BinaryExpr.model_construct(type="binary", op=op, left=left, right=right)


def make_automation(expressions: dict) -> AutomationSchema:
    return AutomationSchema(
        id="s1",
        name="test",
        entry="step_1",
        steps={"step_1": ConditionStep(type="condition", condition=lit(True))},                 # для тестов evaluate_ref шаги не нужны
        expressions=expressions,
    )


# ============================================================
# Успех
# ============================================================

class TestEvaluateRefSuccess:

    def test_simple_ref(self):
        exprs = {"v_a": BinaryExpr(type="binary", op=BinaryOp.ADD, left=lit(3), right=lit(2))}
        ctx = AutomationContext(make_automation(exprs))
        print(ctx.get_expressions())
        assert evaluate_ref(ref("v_a"), ctx) == 5

    def test_chain_of_refs(self):
        # v_c → v_b → v_a = 5+3=8 → v_c = 8*2 = 16
        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), lit(3)),
            "v_b": binary(BinaryOp.ADD, ref("v_a"), lit(3)),
            "v_c": binary(BinaryOp.MUL, ref("v_b"), lit(2)),
        }
        ctx = AutomationContext(make_automation(exprs))
        assert evaluate_ref(ref("v_c"), ctx) == 16

    def test_cache_reused(self):
        # v_a считается один раз
        calls: list[str] = []

        class TrackingContext(AutomationContext):
            def set_expr_cached(self, expr_id, value):
                calls.append(expr_id)
                super().set_expr_cached(expr_id, value)

        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), lit(3)),
            "v_root": binary(
                BinaryOp.ADD,
                ref("v_a"),
                ref("v_a"),         # второй раз — из кэша
            ),
        }
        ctx = TrackingContext(make_automation(exprs))
        assert evaluate_expr(exprs["v_root"], ctx) == 10
        assert calls == ["v_a"]      # закэшировали один раз



# ============================================================
# Ошибки: цикл и глубина
# ============================================================

class TestEvaluateRefCycles:

    def test_self_cycle(self):
        exprs = {"v_a": binary(BinaryOp.ADD, lit(2), ref("v_a"))}
        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError, match="Циклическая зависимость"):
            evaluate_ref(ref("v_a"), ctx)

    def test_two_node_cycle(self):
        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), ref("v_b")),
            "v_b": binary(BinaryOp.ADD, lit(2), ref("v_a")),
        }
        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError, match="Циклическая зависимость"):
            evaluate_ref(ref("v_a"), ctx)

    def test_three_node_cycle(self):
        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), ref("v_c")),
            "v_b": binary(BinaryOp.ADD, lit(2), ref("v_a")),
            "v_c": binary(BinaryOp.ADD, lit(2), ref("v_b")),
        }
        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError, match="Циклическая зависимость"):
            evaluate_ref(ref("v_a"), ctx)

    def test_cycle_message_contains_chain(self):
        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), ref("v_b")),
            "v_b": binary(BinaryOp.ADD, lit(2), ref("v_a")),
        }
        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError) as ex:
            evaluate_ref(ref("v_a"), ctx)
        assert "v_a" in str(ex.value)
        assert "v_b" in str(ex.value)


class TestEvaluateRefDepth:

    def test_depth_limit(self):
        # Цепочка из MAX_DEPTH+5 выражений
        n = AutomationContext.MAX_DEPTH + 5
        exprs = {}
        for i in range(n):
            if i == n - 1:
                exprs[f"v_{i}"] = binary(BinaryOp.ADD, lit(1), lit(1))
            else:
                exprs[f"v_{i}"] = binary(BinaryOp.ADD, lit(1), ref(f"v_{i+1}")) 

        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError, match="глубина"):
            evaluate_ref(ref("v_0"), ctx)

    def test_depth_ok_below_limit(self):
        n = 10   # намного меньше MAX_DEPTH
        exprs = {}
        for i in range(n):
            if i == n - 1:
                exprs[f"v_{i}"] = binary(BinaryOp.ADD, lit(0), lit(1))
            else:
                exprs[f"v_{i}"] = binary(BinaryOp.ADD, lit(0), ref(f"v_{i+1}")) 

        ctx = AutomationContext(make_automation(exprs))
        assert evaluate_ref(ref("v_0"), ctx) == 1


# ============================================================
# Ошибки: не найдено / без контекста
# ============================================================

class TestEvaluateRefErrors:

    def test_ref_without_context(self):
        with pytest.raises(ExpressionError, match="требует AutomationContext"):
            evaluate_ref(ref("v_a"), None)

    def test_ref_not_found(self):
        exprs = {"v_a": binary(BinaryOp.ADD, lit(1), lit(1))}
        ctx = AutomationContext(make_automation(exprs))
        with pytest.raises(ExpressionError, match="не найдено"):
            evaluate_ref(ref("v_missing"), ctx)


# ============================================================
# invalidate — сбрасывает кэш выражений
# ============================================================

class TestInvalidate:

    def test_invalidate_clears_expr_cache(self):
        exprs = {
            "v_a": binary(BinaryOp.ADD, lit(2), lit(3)),
            "v_root": binary(BinaryOp.ADD, lit(2), ref("v_a")),
        }
        ctx = AutomationContext(make_automation(exprs))
        assert evaluate_ref(ref("v_root"), ctx) == 7

        ctx.invalidate()
        assert ctx.get_expr_cached("v_a") is not None or True
        # после invalidate в кэше пусто
        from app.core.entities.automation.automation_context import _NOT_CACHED
        assert ctx.get_expr_cached("v_a") is _NOT_CACHED
        assert ctx.get_expr_cached("v_root") is _NOT_CACHED

    def test_invalidate_clears_running_stack(self):
        exprs = {"v_a": binary(BinaryOp.ADD, lit(2), lit(3))}
        ctx = AutomationContext(make_automation(exprs))
        ctx.enter_expr("v_test")
        ctx.invalidate()
        assert ctx._evaluating == set()
        assert ctx._depth == 0