# app/core/entities/automation/blocks/evaluate_ref.py
"""
Резолвер RefArg → значение выражения из scenario.expressions.

Защита от:
  - циклических ссылок (v_a → v_b → v_a)
  - слишком глубокой вложенности
  - повторного вычисления (кэш в AutomationContext)
"""
from __future__ import annotations

from typing import Any

from app.schemas.automation.automation_v4 import RefArg
from app.core.entities.automation.automation_context import (
    AutomationContext,
    ExpressionError,
    _NOT_CACHED,
)
from app.pkg.logger import get_automatization

logger = get_automatization.get_logger(__name__)


def evaluate_ref(arg: RefArg, ctx: AutomationContext | None):
    """
    Вычисляет RefArg: находит выражение по id и считает его.

    :raises ExpressionError: если ctx=None, выражение не найдено,
                             цикл или превышена глубина.
    """
    if ctx is None:
        raise ExpressionError(
            f"RefArg({arg.ref!r}) требует AutomationContext "
            f"с загруженными expressions"
        )

    # 1. Проверяем кэш
    cached = ctx.get_expr_cached(arg.ref)
    if cached is not _NOT_CACHED:
        return cached

    # 2. Ищем выражение
    expr = ctx.get_expression(arg.ref)
    if expr is None:
        raise ExpressionError(
            f"Выражение не найдено: {arg.ref!r}"
        )

    # 3. Входим в вычисление (проверка цикла + глубины)
    ctx.enter_expr(arg.ref)
    try:
        # Локальный импорт — разрываем цикл модулей expression ↔ evaluate_ref
        from app.core.entities.automation.blocks.expression import evaluate_expr

        result = evaluate_expr(expr, ctx)
        ctx.set_expr_cached(arg.ref, result)
        return result
    except ExpressionError:
        raise
    except Exception as e:
        # Оборачиваем всё остальное в понятную ошибку с контекстом ref-а
        raise ExpressionError(
            f"Ошибка вычисления выражения {arg.ref!r}: {e}"
        ) from e
    finally:
        ctx.exit_expr(arg.ref)