# tests/automation/test_runner.py
import asyncio
from datetime import timedelta

import pytest

from app.schemas.automation.automation_v4 import (
    AutomationSchema, DelayStep, ActionStep, ConditionStep, AwaitStep,
    LiteralArg, BinaryExpr, BinaryOp, RefArg,
)
from app.core.entities.automation.automation_context import AutomationContext
from app.core.entities.automation.automation_v4 import (
    AutomationRunner, StepExecutionError, MAX_STEPS_PER_RUN,
)


# ---------- helpers ----------

def lit(v, dt=None):
    return LiteralArg(type="literal", value=v, data_type=dt)


def ref(name):
    return RefArg(type="ref", ref=name)


def binary(op, left, right):
    return BinaryExpr.model_construct(type="binary", op=op, left=left, right=right)


def make_automation(steps, entry="s1", expressions=None):
    return AutomationSchema(
        id="a1", name="test", entry=entry,
        steps=steps, expressions=expressions or {},
    )


class FakeActionHandler:
    def __init__(self):
        self.calls: list[tuple[str, str, dict]] = []

    async def __call__(self, device, command, params):
        self.calls.append((device, command, params))


@pytest.fixture
def handler():
    return FakeActionHandler()


@pytest.fixture
def runner(handler):
    return AutomationRunner(action_handler=handler)


# ---------- DelayStep ----------

class TestDelayStep:

    @pytest.mark.asyncio
    async def test_delay_and_finish(self, runner):
        steps = {"s1": DelayStep(type="delay", duration=lit(0.05), next=None)}
        await runner.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_delay_transition(self, runner, handler):
        steps = {
            "s1": DelayStep(type="delay", duration=lit(0.01), next="s2"),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        await runner.run(make_automation(steps))
        assert handler.calls == [("d", "c", {})]

    @pytest.mark.asyncio
    async def test_delay_seconds_numeric_string(self, runner):
        steps = {"s1": DelayStep(type="delay", duration=lit("0.01"), next=None)}
        await runner.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_delay_timedelta(self, runner):
        steps = {"s1": DelayStep(
            type="delay",
            duration=lit("PT0.01S", dt="duration"),
            next=None,
        )}
        await runner.run(make_automation(steps))


# ---------- ActionStep ----------

class TestActionStep:

    @pytest.mark.asyncio
    async def test_simple_action(self, runner, handler):
        steps = {"s1": ActionStep(
            type="action", device="light_hall",
            command="turn_on", next=None,
        )}
        await runner.run(make_automation(steps))
        assert handler.calls == [("light_hall", "turn_on", {})]

    @pytest.mark.asyncio
    async def test_action_with_params(self, runner, handler):
        steps = {"s1": ActionStep(
            type="action", device="light_hall", command="turn_on",
            params={"brightness": lit(20), "color": lit("warm")},
            next=None,
        )}
        await runner.run(make_automation(steps))
        assert handler.calls == [
            ("light_hall", "turn_on", {"brightness": 20, "color": "warm"}),
        ]

    @pytest.mark.asyncio
    async def test_action_with_expr_param(self, runner, handler):
        steps = {"s1": ActionStep(
            type="action", device="l", command="set",
            params={"value": ref("v_bright")},
            next=None,
        )}
        exprs = {"v_bright": binary(op=BinaryOp.ADD, left=lit(40), right=lit(10))}
        await runner.run(make_automation(steps, expressions=exprs))
        assert handler.calls == [("l", "set", {"value": 50})]


# ---------- ConditionStep ----------

class TestConditionStep:

    @pytest.mark.asyncio
    async def test_true_branch(self, runner, handler):
        steps = {
            "s1": ConditionStep(
                type="condition",
                condition=ref("c_true"),
                on_true="s2", on_false="s3",
            ),
            "s2": ActionStep(type="action", device="d", command="true_branch", next=None),
            "s3": ActionStep(type="action", device="d", command="false_branch", next=None),
        }
        exprs = {"c_true": binary(BinaryOp.EQ, lit(1), lit(1))}
        await runner.run(make_automation(steps, expressions=exprs))
        assert handler.calls == [("d", "true_branch", {})]

    @pytest.mark.asyncio
    async def test_false_branch(self, runner, handler):
        steps = {
            "s1": ConditionStep(
                type="condition",
                condition=ref("c_false"),
                on_true="s2", on_false="s3",
            ),
            "s2": ActionStep(type="action", device="d", command="true_branch", next=None),
            "s3": ActionStep(type="action", device="d", command="false_branch", next=None),
        }
        exprs = {"c_false": binary(BinaryOp.EQ, lit(1), lit(2))}
        await runner.run(make_automation(steps, expressions=exprs))
        assert handler.calls == [("d", "false_branch", {})]

    @pytest.mark.asyncio
    async def test_true_branch_null_ends(self, runner, handler):
        steps = {"s1": ConditionStep(
            type="condition",
            condition=lit(True, "boolean"),
            on_true=None, on_false=None,
        )}
        await runner.run(make_automation(steps))
        assert handler.calls == []


# ---------- AwaitStep ----------

class TestAwaitStep:

    @pytest.mark.asyncio
    async def test_await_satisfied(self, runner, handler):
        steps = {
            "s1": AwaitStep(
                type="await",
                condition=lit(True, "boolean"),
                timeout=lit(1.0),   # 1 сек
                next="s2", on_timeout="s3",
            ),
            "s2": ActionStep(type="action", device="d", command="ok", next=None),
            "s3": ActionStep(type="action", device="d", command="timeout", next=None),
        }
        await runner.run(make_automation(steps))
        assert handler.calls == [("d", "ok", {})]

    @pytest.mark.asyncio
    async def test_await_timeout(self, runner, handler):
        steps = {
            "s1": AwaitStep(
                type="await",
                condition=lit(False, "boolean"),
                timeout=lit(0.1),
                next="s2", on_timeout="s3",
            ),
            "s2": ActionStep(type="action", device="d", command="ok", next=None),
            "s3": ActionStep(type="action", device="d", command="timeout", next=None),
        }
        await runner.run(make_automation(steps))
        assert handler.calls == [("d", "timeout", {})]


# ---------- Ошибки ----------

class TestRunnerErrors:

    @pytest.mark.asyncio
    async def test_step_not_found(self, runner):
        from app.schemas.automation.automation_v4 import AutomationSchema

        # Собираем схему в обход валидации — специально,
        # чтобы проверить защиту самого раннера.
        steps = {"s1": DelayStep(type="delay", duration=lit(0.01), next="missing")}
        automation = AutomationSchema.model_construct(
            id="a1",
            name="test",
            entry="s1",
            steps=steps,
            expressions={},
            trigger=[],
            is_enabled=True,
            schema_version="1.0",
            description=None,
        )

        with pytest.raises(StepExecutionError, match="не найден"):
            await runner.run(automation)

    @pytest.mark.asyncio
    async def test_cycle_max_steps(self, runner):
        # s1 → s2 → s1 — вечный цикл
        steps = {
            "s1": DelayStep(type="delay", duration=lit(0), next="s2"),
            "s2": DelayStep(type="delay", duration=lit(0), next="s1"),
        }
        with pytest.raises(StepExecutionError, match="максимальное число шагов"):
            await runner.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_action_handler_error_wrapped(self, runner):
        class Failing:
            async def __call__(self, *a, **kw):
                raise RuntimeError("boom")
        r = AutomationRunner(action_handler=Failing())
        steps = {"s1": ActionStep(type="action", device="d", command="c", next=None)}
        with pytest.raises(StepExecutionError, match="boom"):
            await r.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_bad_duration_type(self, runner):
        steps = {"s1": DelayStep(
            type="delay",
            duration=lit("abc"),   # не число
            next=None,
        )}
        with pytest.raises(StepExecutionError):
            await runner.run(make_automation(steps))