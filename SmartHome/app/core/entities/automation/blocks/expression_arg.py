# app/core/entities/automation/blocks/expression_arg.py
"""
Общий резолвер ExpressionArg → рантайм-значение.

Поддерживаемые типы:
  LiteralArg — константа (число / строка / bool / time / duration)
  PathArg    — путь к данным (device.*, system.*, variable.*)
  RefArg     — ссылка на выражение (пока не поддерживается)

Кэш: EvalContext хранит значения PathArg в рамках одного вычисления,
чтобы одно и то же поле не читалось из стора дважды. Между шагами
сценария контекст нужно сбрасывать (или создавать новый).
"""
from __future__ import annotations

from typing import Any

from app.schemas.automation.automation_v4 import (
    ExpressionArg,
    LiteralArg,
    PathArg,
    RefArg,
)
from app.core.entities.automation.blocks.literalArg import resolve_literal
from app.core.entities.automation.blocks.pathArg import resolve_path
from app.core.entities.automation.blocks.evaluate_ref import evaluate_ref
from app.core.entities.automation.automation_context import AutomationContext
from app.pkg.logger import get_automatization

logger = get_automatization.get_logger(__name__)



# ============================================================
# Публичная точка входа
# ============================================================

def resolve_arg(
    arg: ExpressionArg,
    ctx: AutomationContext | None = None,
):
    """
    Возвращает рантайм-значение ExpressionArg.

    :param arg: LiteralArg | PathArg | RefArg
    :param ctx: опциональный EvalContext для кэширования PathArg.
                Если None — PathArg читается без кэша.
    :return: int | float | bool | str | time | timedelta | Any

    :raises NotImplementedError: для RefArg
    :raises TypeError:            для неизвестного типа
    """
    if isinstance(arg, LiteralArg):
        return resolve_literal(arg)

    if isinstance(arg, PathArg):
        if ctx is not None:
            return ctx.get_path(arg)
        return resolve_path(arg)

    if isinstance(arg, RefArg):
        return evaluate_ref(arg, ctx)   # ← ВЕРНУТЬ результат

    raise TypeError(
        f"Неизвестный тип ExpressionArg: {type(arg).__name__}"
    )