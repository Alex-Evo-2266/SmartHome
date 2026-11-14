
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

    ref = arg.ref

    logger.debug(
        "[EvaluateRef] Начало разрешения RefArg: ref=%r",
        ref,
    )

    # 1. Проверяем контекст
    if ctx is None:
        logger.error(
            "[EvaluateRef] AutomationContext отсутствует: ref=%r",
            ref,
        )
        raise ExpressionError(
            f"RefArg({ref!r}) требует AutomationContext "
            f"с загруженными expressions"
        )

    # 2. Проверяем кэш
    cached = ctx.get_expr_cached(ref)

    if cached is not _NOT_CACHED:
        logger.debug(
            "[EvaluateRef] CACHE HIT: ref=%r, result=%r",
            ref,
            cached,
        )
        return cached

    logger.debug(
        "[EvaluateRef] CACHE MISS: ref=%r",
        ref,
    )

    # 3. Ищем выражение
    logger.debug(
        "[EvaluateRef] Поиск выражения: ref=%r",
        ref,
    )

    expr = ctx.get_expression(ref)

    if expr is None:
        logger.error(
            "[EvaluateRef] Выражение не найдено: ref=%r",
            ref,
        )
        raise ExpressionError(
            f"Выражение не найдено: {ref!r}"
        )

    logger.debug(
        "[EvaluateRef] Выражение найдено: ref=%r, expr=%r",
        ref,
        expr,
    )

    # 4. Входим в вычисление (проверка цикла + глубины)
    logger.debug(
        "[EvaluateRef] Вход в вычисление: ref=%r",
        ref,
    )

    try:
        ctx.enter_expr(ref)
    except ExpressionError as e:
        logger.error(
            "[EvaluateRef] Не удалось войти в вычисление: "
            "ref=%r, error=%s",
            ref,
            e,
            exc_info=True,
        )
        raise

    try:
        # Локальный импорт — разрываем цикл модулей expression ↔ evaluate_ref
        from app.core.entities.automation.blocks.expression import evaluate_expr

        logger.debug(
            "[EvaluateRef] Запуск evaluate_expr: ref=%r",
            ref,
        )

        result = evaluate_expr(expr, ctx)

        logger.debug(
            "[EvaluateRef] Вычисление завершено: ref=%r, result=%r, type=%s",
            ref,
            result,
            type(result).__name__,
        )

        # 5. Сохраняем результат в кэш
        ctx.set_expr_cached(ref, result)

        logger.debug(
            "[EvaluateRef] Результат сохранён в кэш: ref=%r",
            ref,
        )

        return result

    except ExpressionError as e:
        logger.error(
            "[EvaluateRef] Ошибка выражения: ref=%r, error=%s",
            ref,
            e,
            exc_info=True,
        )
        raise

    except Exception as e:
        logger.exception(
            "[EvaluateRef] Необработанная ошибка вычисления: ref=%r",
            ref,
        )

        raise ExpressionError(
            f"Ошибка вычисления выражения {ref!r}: {e}"
        ) from e

    finally:
        ctx.exit_expr(ref)

        logger.debug(
            "[EvaluateRef] Выход из вычисления: ref=%r",
            ref,
        )
