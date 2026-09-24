# app/core/entities/automation/runner.py
"""
Выполнение сценария: проходит граф шагов от entry до конца.

Шаги:
  DelayStep     — пауза
  ActionStep    — команда устройству через ActionHandler
  ConditionStep — развилка (on_true / on_false)
  AwaitStep     — ожидание условия с таймаутом

Между шагами кэш AutomationContext сбрасывается — каждый шаг видит
актуальное состояние стора.
"""
from __future__ import annotations

import asyncio
import time
from datetime import timedelta, datetime, timezone
from typing import Any, Protocol

from app.schemas.automation.automation_v4 import (
    AutomationSchema, Step,
    DelayStep, ActionStep, ConditionStep, AwaitStep,
)
from app.core.entities.automation.automation_context import (
    AutomationContext, ExpressionError
)
from app.core.entities.automation.blocks.expression import (
    evaluate_expr, to_bool
)
from app.core.entities.automation.blocks.expression_arg import resolve_arg
from app.pkg.logger import get_automatization
from app.scheduler import scheduler
from app.core.state.get_store import get_container

logger = get_automatization.get_logger(__name__)


MAX_STEPS_PER_RUN = 1000
AWAIT_POLL_INTERVAL = 0.5


class StepExecutionError(Exception):
    """Ошибка выполнения шага сценария."""


class ActionHandler(Protocol):
    """Хендлер команд действий. Инжектится снаружи."""
    async def __call__(
        self,
        device: str,
        command: str,
        params: dict[str, Any],
    ) -> None: ...


class AutomationRunner:
    """Выполняет сценарий от entry до конца."""

    def __init__(self, action_handler: ActionHandler) -> None:
        self._action_handler = action_handler

    async def run(
        self,
        automation: AutomationSchema,
        ctx: AutomationContext | None = None,
        startStep: str | None = None
    ) -> None:
        """
        Запускает сценарий.

        :param automation: сценарий
        :param ctx: контекст. Если None — создаётся свежий.
        :raises StepExecutionError: при ошибке в любом шаге
                                    (включая превышение MAX_STEPS_PER_RUN).
        """
        if ctx is None:
            ctx = AutomationContext(automation)

        current_id: str | None = automation.entry
        if not startStep is None:
            current_id = startStep
        steps_count = 0

        while current_id is not None:
            if steps_count >= MAX_STEPS_PER_RUN:
                raise StepExecutionError(
                    f"Сценарий '{automation.id}': превышено максимальное "
                    f"число шагов ({MAX_STEPS_PER_RUN}). Проверьте граф на циклы."
                )
            steps_count += 1

            step = ctx.get_step(current_id)
            if step is None:
                raise StepExecutionError(f"Шаг не найден: {current_id!r}")

            # Свежие данные перед каждым шагом
            ctx.invalidate()

            logger.debug("Run step %s (%s)", current_id, step.type)

            try:
                next_id = await self._execute_step(step, current_id, ctx)
            except ExpressionError as e:
                raise StepExecutionError(
                    f"Ошибка выражения в шаге {current_id!r}: {e}"
                ) from e
            except StepExecutionError:
                raise
            except Exception as e:
                raise StepExecutionError(
                    f"Ошибка шага {current_id!r}: {e}"
                ) from e

            current_id = next_id

        logger.info(
            "Automation '%s' completed (%d steps)",
            automation.id, steps_count,
        )

    # ------------------------------------------------------------------
    # Диспетчер
    # ------------------------------------------------------------------

    async def _execute_step(
        self,
        step: Step,
        step_id: str,
        ctx: AutomationContext,
    ) -> str | None:
        if isinstance(step, DelayStep):
            return await self._run_delay(step=step, step_id=step_id, ctx=ctx)
        if isinstance(step, ActionStep):
            return await self._run_action(step, ctx)
        if isinstance(step, ConditionStep):
            return await self._run_condition(step, ctx)
        if isinstance(step, AwaitStep):
            return await self._run_await(step=step, step_id=step_id, ctx=ctx)
        raise StepExecutionError(f"Неизвестный тип шага: {type(step).__name__}")

    # ------------------------------------------------------------------
    # DelayStep
    # ------------------------------------------------------------------

    async def _run_delay(
        self,
        step_id: str,                  # ← НОВЫЙ параметр
        step: DelayStep,
        ctx: AutomationContext,
    ) -> str | None:
        seconds = self._resolve_seconds(step.duration, ctx)
        automation_id = ctx.get_automation_id()

        # При next=None продолжать некуда — просто завершаемся
        if step.next is None:
            logger.debug("Delay %.3f sec (no continuation)", seconds)
            return None

        scheduler.add_job(
            self._continue_after_delay,
            "date",
            run_date=datetime.now(timezone.utc) + timedelta(seconds=seconds),
            args=[automation_id, step.next],
            id=f"auto:{automation_id}:delay:{step_id}",   # ← новый формат
            replace_existing=True,
            misfire_grace_time=300,
        )
        return None                    # ← БАГ-ФИКС: не идём дальше

    async def _continue_after_delay(self, automation_id: str, next_step: str | None) -> None:
        if next_step is None:
            return
        automation = get_container().automation_store.get_automation_by_id(automation_id)
        if automation is None:
            return
        await self.run(automation, startStep=next_step)

    # ------------------------------------------------------------------
    # ActionStep
    # ------------------------------------------------------------------

    async def _run_action(
        self,
        step: ActionStep,
        ctx: AutomationContext,
    ) -> str | None:
        params = {name: resolve_arg(arg, ctx) for name, arg in step.params.items()}
        logger.debug("Action %s.%s %s", step.device, step.command, params)
        await self._action_handler(step.device, step.command, params)
        return step.next

    # ------------------------------------------------------------------
    # ConditionStep
    # ------------------------------------------------------------------

    async def _run_condition(
        self,
        step: ConditionStep,
        ctx: AutomationContext,
    ) -> str | None:
        value = resolve_arg(step.condition, ctx)

        result = to_bool(value)
        logger.debug("Condition %r → %s", value, result)
        return step.on_true if result else step.on_false

    # ------------------------------------------------------------------
    # AwaitStep
    # ------------------------------------------------------------------

    # async def _run_await(
    #     self,
    #     step: AwaitStep,
    #     step_id: str,
    #     ctx: AutomationContext,
    # ) -> str | None:
    #     timeout_sec: float | None = None
    #     if step.timeout is not None:
    #         timeout_sec = self._resolve_seconds(step.timeout, ctx)
        # step.trigger

        # get_container().automation_store.add_await_automation()
        # while True:
        #     ctx.invalidate()  # свежие данные на каждой итерации
        #     value = resolve_arg(step.condition, ctx)

        #     if to_bool(value):
        #         logger.debug("Await satisfied")
        #         return step.next

        #     if deadline is not None and time.monotonic() >= deadline:
        #         logger.debug("Await timeout")
        #         return step.on_timeout

        #     await asyncio.sleep(AWAIT_POLL_INTERVAL)

    async def _run_await(
        self,
        step_id: str,
        step: AwaitStep,
        ctx: AutomationContext,
    ) -> str | None:
        automation_id = ctx.get_automation_id()
        manager = get_container().automation_store

        # 1. Регистрируем подписку в индексах (ones=True)
        if(step.next):
            manager.add_await_automation(
                automation=ctx.get_automation(),
                trigger=step.trigger,
                start_step=step.next,
                await_step_id=step_id,
            )

            # 2. Регистрируем таймаут через APScheduler (если задан)
            if step.timeout is not None:
                timeout_sec = self._resolve_seconds(step.timeout, ctx)
                scheduler.add_job(
                    self._handle_await_timeout,
                    "date",
                    run_date=datetime.now(timezone.utc) + timedelta(seconds=timeout_sec),
                    args=[automation_id, step_id, step.on_timeout],
                    id=f"auto:{automation_id}:await:{step_id}:timeout",
                    replace_existing=True,
                    misfire_grace_time=60,
                )

        # 3. Раннер останавливается. Продолжение:
        #    - по событию (manager.on_device_patch → callback)
        #    - по таймауту (_handle_await_timeout)
        return None

    async def _handle_await_timeout(
        self,
        automation_id: str,
        step_id: str,
        on_timeout: str | None,
    ) -> None:
        """Сработал таймаут ожидания: снимаем подписку и идём в on_timeout."""
        manager = get_container().automation_store

        # 1. Снимаем подписку из индексов — иначе останется навсегда
        manager.remove_await_subscription(automation_id, step_id)

        if on_timeout is None:
            return

        # 2. Продолжаем сценарий с ветки on_timeout
        automation = manager.get_automation_by_id(automation_id)
        if automation is None:
            return

        await self.run(automation, startStep=on_timeout)

    # ------------------------------------------------------------------
    # Утилиты
    # ------------------------------------------------------------------

    def _resolve_seconds(self, arg: Any, ctx: AutomationContext) -> float:
        """Резолвит duration / timeout в секунды."""
        value = resolve_arg(arg, ctx)

        if isinstance(value, timedelta):
            return value.total_seconds()

        if isinstance(value, bool):
            raise StepExecutionError(
                f"Ожидается число секунд или timedelta, получили bool: {value!r}"
            )

        if isinstance(value, (int, float)):
            return float(value)

        # Терпимый разбор строки: "0.01", "1.5" — как секунды
        if isinstance(value, str):
            s = value.strip()
            try:
                return float(s)
            except ValueError:
                pass

        raise StepExecutionError(
            f"Ожидается число секунд или timedelta, получили {value!r}"
        )


async def mok(
    device: str,
    command: str,
    params: dict[str, Any]
) -> None:
    # your implementation
    ...

automation_v4 = AutomationRunner(mok)


async def run_adapter(automation: AutomationSchema, startStep: str | None) -> None:
    await automation_v4.run(automation, startStep=startStep)