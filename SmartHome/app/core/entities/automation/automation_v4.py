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
from datetime import timedelta
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
                next_id = await self._execute_step(step, ctx)
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
        ctx: AutomationContext,
    ) -> str | None:
        if isinstance(step, DelayStep):
            return await self._run_delay(step, ctx)
        if isinstance(step, ActionStep):
            return await self._run_action(step, ctx)
        if isinstance(step, ConditionStep):
            return await self._run_condition(step, ctx)
        if isinstance(step, AwaitStep):
            return await self._run_await(step, ctx)
        raise StepExecutionError(f"Неизвестный тип шага: {type(step).__name__}")

    # ------------------------------------------------------------------
    # DelayStep
    # ------------------------------------------------------------------

    async def _run_delay(
        self,
        step: DelayStep,
        ctx: AutomationContext,
    ) -> str | None:
        seconds = self._resolve_seconds(step.duration, ctx)
        logger.debug("Delay %.3f sec", seconds)
        await asyncio.sleep(seconds)
        return step.next

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

    async def _run_await(
        self,
        step: AwaitStep,
        ctx: AutomationContext,
    ) -> str | None:
        timeout_sec: float | None = None
        if step.timeout is not None:
            timeout_sec = self._resolve_seconds(step.timeout, ctx)

        deadline = (
            time.monotonic() + timeout_sec if timeout_sec is not None else None
        )

        while True:
            ctx.invalidate()  # свежие данные на каждой итерации
            value = resolve_arg(step.condition, ctx)

            if to_bool(value):
                logger.debug("Await satisfied")
                return step.next

            if deadline is not None and time.monotonic() >= deadline:
                logger.debug("Await timeout")
                return step.on_timeout

            await asyncio.sleep(AWAIT_POLL_INTERVAL)

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