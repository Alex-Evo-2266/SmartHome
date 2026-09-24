# tests/automation/test_runner.py
import asyncio
from datetime import timedelta
from unittest.mock import MagicMock, patch

import pytest

from app.schemas.automation.automation_v4 import (
    AutomationSchema, DelayStep, ActionStep, ConditionStep, AwaitStep,
    LiteralArg, BinaryExpr, BinaryOp, RefArg,
    DeviceTrigger, WeeklyTimeTrigger,
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


def make_automation(steps, entry="s1", expressions=None, id="a1"):
    return AutomationSchema(
        id=id, name="test", entry=entry,
        steps=steps, expressions=expressions or {},
    )


class FakeActionHandler:
    def __init__(self):
        self.calls: list[tuple[str, str, dict]] = []

    async def __call__(self, device, command, params):
        self.calls.append((device, command, params))


class FakeScheduler:
    """Ловит add_job / remove_job, не выполняя их."""
    def __init__(self):
        self.jobs: dict[str, dict] = {}
        self.removed: list[str] = []

    def add_job(
        self,
        func,
        trigger=None,
        run_date=None,
        args=None,
        id: str | None = None,
        replace_existing: bool = False,
        misfire_grace_time=None,
    ):
        # APScheduler допускает id=None — генерирует сам.
        # В фейке генерируем детерминированный ключ.
        key = id if id is not None else f"__auto_{len(self.jobs)}"
        self.jobs[key] = {
            "func": func,
            "run_date": run_date,
            "args": args,
            "misfire_grace_time": misfire_grace_time,
        }

    def remove_job(self, job_id: str):
        self.removed.append(job_id)
        self.jobs.pop(job_id, None)

    def get_jobs(self):
        return []


class FakeAutomationStore:
    """Минимальный менеджер для тестов."""
    def __init__(self):
        self.automations: dict[str, AutomationSchema] = {}
        self.await_registrations: list[dict] = []

    def get_automation_by_id(self, aid):
        return self.automations.get(aid)

    def add_await_automation(self, automation, trigger, start_step,
                             await_step_id, time_out=None):
        self.await_registrations.append({
            "automation_id": automation.id,
            "trigger": trigger,
            "start_step": start_step,
            "await_step_id": await_step_id,
        })
        return True


@pytest.fixture
def handler():
    return FakeActionHandler()


@pytest.fixture
def scheduler_fake():
    return FakeScheduler()


@pytest.fixture
def store_fake():
    return FakeAutomationStore()


@pytest.fixture
def runner(handler, scheduler_fake, store_fake):
    """
    Раннер с подменёнными scheduler и store.

    Патчим модульные имена в `runner` (он импортирует их через
    `from app.scheduler import scheduler`), а `get_container` — через
    прямой доступ в namespace раннера.
    """
    with patch("app.core.entities.automation.automation_v4.scheduler", scheduler_fake), \
         patch("app.core.entities.automation.automation_v4.get_container") as gc:
        gc.return_value.automation_store = store_fake
        # контекст тоже должен отдавать id и automation
        yield AutomationRunner(action_handler=handler)


# ---------- DelayStep (без изменений) ----------

class TestDelayStep:

    @pytest.mark.asyncio
    async def test_delay_and_finish(self, runner, scheduler_fake):
        steps = {"s1": DelayStep(type="delay", duration=lit(0.05), next=None)}
        await runner.run(make_automation(steps))
        # delay с next=None — job не ставим (нечего продолжать)
        assert scheduler_fake.jobs == {}

    @pytest.mark.asyncio
    async def test_delay_schedules_job(self, runner, scheduler_fake):
        steps = {
            "s1": DelayStep(type="delay", duration=lit(2.0), next="s2"),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        await runner.run(make_automation(steps))
        # раннер завершился сразу — job добавлен, s2 НЕ выполнен
        assert len(scheduler_fake.jobs) == 1
        job_id = list(scheduler_fake.jobs.keys())[0]
        assert job_id.startswith("auto:a1:delay:")
        # args=[automation_id, next_step]
        args = scheduler_fake.jobs[job_id]["args"]
        assert args == ["a1", "s2"]


    @pytest.mark.asyncio
    async def test_delay_seconds_numeric_string(self, runner, scheduler_fake):
        steps = {
            "s1": DelayStep(type="delay", duration=lit("2.0"), next="s2"),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        await runner.run(make_automation(steps))
        assert len(scheduler_fake.jobs) == 1

    @pytest.mark.asyncio
    async def test_delay_timedelta(self, runner, scheduler_fake):
        steps = {
            "s1": DelayStep(
                type="delay",
                duration=lit("PT2S", dt="duration"),
                next="s2",
            ),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        await runner.run(make_automation(steps))
        assert len(scheduler_fake.jobs) == 1


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
        exprs = {"v_bright": binary(BinaryOp.ADD, lit(40), lit(10))}
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


# ---------- AwaitStep (новая семантика) ----------

class TestAwaitStep:

    @pytest.mark.asyncio
    async def test_registers_subscription_and_exits(self, runner, store_fake, scheduler_fake):
        """AwaitStep: подписка зарегистрирована, раннер вышел."""
        steps = {
            "s1": AwaitStep(
                type="await",
                trigger=DeviceTrigger(type="device", device="door", field="state"),
                next="s2",
                on_timeout=None,
            ),
            "s2": ActionStep(type="action", device="d", command="after_await", next=None),
        }
        automation = make_automation(steps)
        store_fake.automations["a1"] = automation

        await runner.run(automation)

        # Подписка есть
        assert len(store_fake.await_registrations) == 1
        reg = store_fake.await_registrations[0]
        assert reg["automation_id"] == "a1"
        assert reg["start_step"] == "s2"
        assert reg["await_step_id"] == "s1"

        # Раннер не пошёл дальше — s2 не выполнен
        # (handler не вызывается, потому что callback вне раннера)

        # Timeout не задан — job не ставится
        assert scheduler_fake.jobs == {}

    @pytest.mark.asyncio
    async def test_timeout_registered(self, runner, store_fake, scheduler_fake):
        """AwaitStep с timeout: регистрируется timeout-job."""
        steps = {
            "s1": AwaitStep(
                type="await",
                trigger=DeviceTrigger(type="device", device="door", field="state"),
                timeout=lit(30.0),
                next="s2",
                on_timeout="s3",
            ),
            "s2": ActionStep(type="action", device="d", command="ok", next=None),
            "s3": ActionStep(type="action", device="d", command="timeout", next=None),
        }
        automation = make_automation(steps)
        store_fake.automations["a1"] = automation

        await runner.run(automation)

        # timeout-job создан
        assert len(scheduler_fake.jobs) == 1
        job_id = list(scheduler_fake.jobs.keys())[0]
        assert job_id == "auto:a1:await:s1:timeout"
        args = scheduler_fake.jobs[job_id]["args"]
        assert args == ["a1", "s1", "s3"]

    @pytest.mark.asyncio
    async def test_no_timeout_no_job(self, runner, store_fake, scheduler_fake):
        steps = {
            "s1": AwaitStep(
                type="await",
                trigger=WeeklyTimeTrigger(
                    type="time", kind="weekly",
                    at="22:30", weekdays=[0],
                ),
                next="s2",
            ),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        automation = make_automation(steps)
        store_fake.automations["a1"] = automation

        await runner.run(automation)

        assert scheduler_fake.jobs == {}
        assert len(store_fake.await_registrations) == 1

    @pytest.mark.asyncio
    async def test_await_returns_none(self, runner, store_fake, scheduler_fake):
        """AwaitStep не идёт дальше сам — возвращает None."""
        steps = {
            "s1": AwaitStep(
                type="await",
                trigger=DeviceTrigger(type="device", device="door", field="state"),
                next="s2",
            ),
            "s2": ActionStep(type="action", device="d", command="should_not_run", next=None),
        }
        automation = make_automation(steps)
        store_fake.automations["a1"] = automation

        handler = runner._action_handler
        await runner.run(automation)

        # s2 НЕ выполнен — раннер вышел на s1
        assert handler.calls == []


# ---------- Ошибки ----------

class TestRunnerErrors:

    @pytest.mark.asyncio
    async def test_step_not_found(self, runner):
        from app.schemas.automation.automation_v4 import AutomationSchema

        steps = {"s1": ActionStep(type="action", device="d", command="c", next="missing")}
        automation = AutomationSchema.model_construct(
            id="a1", name="test", entry="s1",
            steps=steps, expressions={},
            trigger=[], is_enabled=True,
            schema_version="1.0", description=None,
        )

        with pytest.raises(StepExecutionError, match="не найден"):
            await runner.run(automation)

    @pytest.mark.asyncio
    async def test_cycle_max_steps(self, runner):
        # s1 → s2 → s1 (без delay — оба шага action с next)
        steps = {
            "s1": ActionStep(type="action", device="d", command="c1", next="s2"),
            "s2": ActionStep(type="action", device="d", command="c2", next="s1"),
        }
        with pytest.raises(StepExecutionError, match="максимальное число шагов"):
            await runner.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_action_handler_error_wrapped(self, scheduler_fake, store_fake):
        class Failing:
            async def __call__(self, *a, **kw):
                raise RuntimeError("boom")

        with patch("app.core.entities.automation.automation_v4.scheduler", scheduler_fake), \
             patch("app.core.entities.automation.automation_v4.get_container") as gc:
            gc.return_value.automation_store = store_fake
            r = AutomationRunner(action_handler=Failing())

            steps = {"s1": ActionStep(type="action", device="d", command="c", next=None)}
            with pytest.raises(StepExecutionError, match="boom"):
                await r.run(make_automation(steps))

    @pytest.mark.asyncio
    async def test_bad_duration_type(self, runner):
        steps = {
            "s1": DelayStep(type="delay", duration=lit("abc"), next="s2"),
            "s2": ActionStep(type="action", device="d", command="c", next=None),
        }
        with pytest.raises(StepExecutionError):
            await runner.run(make_automation(steps))