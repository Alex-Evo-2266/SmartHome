# tests/automation/test_resolve_arg.py
import pytest
from app.schemas.automation.automation_v4 import (
    BinaryExpr, UnaryExpr, CallExpr, GroupExpr,
    LiteralArg, RefArg, PathArg, BinaryOp, UnaryOp, GroupOp, AutomationSchema, ConditionStep
)
from app.core.entities.automation.blocks.expression_arg import (
    resolve_arg, AutomationContext
)
import app.core.entities.automation.automation_context as ae
import app.core.entities.automation.blocks.expression_arg as ea

from app.core.entities.automation.blocks.evaluate_ref import ExpressionError


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
        steps={"step_1": ConditionStep(type="condition", condition=lit(True))},                 # для тестов evaluate_ref шаги не нужны
        expressions=expressions,
    )

@pytest.fixture
def ctx() -> AutomationContext:
    exprs = {"v_a": lit(5)}
    return AutomationContext(make_automation(exprs))


@pytest.mark.literal
class TestResolveArgLiteral:

    def test_number(self):
        assert resolve_arg(LiteralArg(type="literal", value=42)) == 42

    def test_string(self):
        assert resolve_arg(LiteralArg(type="literal", value="hi")) == "hi"


@pytest.mark.device
class TestResolveArgPath:

    def test_path_without_ctx(self, monkeypatch):
        monkeypatch.setattr(
            ea, "resolve_path",
            lambda arg: f"resolved:{arg.path}",
        )
        arg = PathArg(type="path", path="device.door.state")
        assert resolve_arg(arg) == "resolved:device.door.state"

    def test_path_with_ctx_caches(self, monkeypatch):

        calls = []
        def fake_resolve(arg):
            calls.append(arg.path)
            return "X"
        monkeypatch.setattr(ae, "resolve_path", fake_resolve)

        exprs = {"v_a": binary(BinaryOp.ADD, left=lit(2), right=lit(3))}
        ctx = AutomationContext(make_automation(exprs))
        arg = PathArg(type="path", path="device.door.state")

        assert resolve_arg(arg, ctx) == "X"
        assert resolve_arg(arg, ctx) == "X"     # из кэша
        assert len(calls) == 1                  # стор дёрнулся один раз

    def test_ctx_invalidate_clears(self, monkeypatch):
        calls = []
        monkeypatch.setattr(
            ae, "resolve_path",
            lambda arg: calls.append(arg.path) or "X",
        )
        exprs = {"v_a": binary(BinaryOp.ADD, left=lit(2), right=lit(3))}
        ctx = AutomationContext(make_automation(exprs))
        arg = PathArg(type="path", path="device.door.state")

        resolve_arg(arg, ctx)
        ctx.invalidate()
        resolve_arg(arg, ctx)

        assert len(calls) == 2


class TestResolveArgRef:

    def test_ref_not_implemented(self):
        arg = RefArg(type="ref", ref="c_night")
        with pytest.raises(ExpressionError, match="c_night"):
            resolve_arg(arg)


class TestResolveArgUnknown:

    def test_unknown_type(self):
        class Fake:  # не LiteralArg / PathArg / RefArg
            pass
        with pytest.raises(TypeError, match="Fake"):
            resolve_arg(Fake())   # type: ignore[arg-type]