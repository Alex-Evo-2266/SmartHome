# tests/automation/test_resolve_arg.py
import pytest
from app.schemas.automation.automation_v4 import LiteralArg, PathArg, RefArg
from app.core.entities.automation.blocks.expression_arg import (
    resolve_arg, EvalContext,
)
import app.core.entities.automation.blocks.expression_arg as ea


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
        monkeypatch.setattr(ea, "resolve_path", fake_resolve)

        ctx = EvalContext()
        arg = PathArg(type="path", path="device.door.state")

        assert resolve_arg(arg, ctx) == "X"
        assert resolve_arg(arg, ctx) == "X"     # из кэша
        assert len(calls) == 1                  # стор дёрнулся один раз

    def test_ctx_invalidate_clears(self, monkeypatch):
        calls = []
        monkeypatch.setattr(
            ea, "resolve_path",
            lambda arg: calls.append(arg.path) or "X",
        )
        ctx = EvalContext()
        arg = PathArg(type="path", path="device.door.state")

        resolve_arg(arg, ctx)
        ctx.invalidate()
        resolve_arg(arg, ctx)

        assert len(calls) == 2


class TestResolveArgRef:

    def test_ref_not_implemented(self):
        arg = RefArg(type="ref", ref="c_night")
        with pytest.raises(NotImplementedError, match="c_night"):
            resolve_arg(arg)


class TestResolveArgUnknown:

    def test_unknown_type(self):
        class Fake:  # не LiteralArg / PathArg / RefArg
            pass
        with pytest.raises(TypeError, match="Fake"):
            resolve_arg(Fake())   # type: ignore[arg-type]