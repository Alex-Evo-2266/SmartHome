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
from app.pkg.logger import get_automatization

logger = get_automatization.get_logger(__name__)


# ============================================================
# Контекст вычисления (кэш PathArg)
# ============================================================

class EvalContext:
    """
    Кэш значений PathArg на время одного вычисления выражения.

    Пример:
        ctx = EvalContext()
        a = resolve_arg(arg1, ctx)   # device.temp.value → 25
        b = resolve_arg(arg2, ctx)   # device.temp.value → 25 (из кэша)

    Между шагами сценария создавай новый контекст (или вызывай
    .invalidate()), чтобы увидеть актуальное состояние стора.
    """

    __slots__ = ("_cache",)

    def __init__(self) -> None:
        self._cache: dict[str, Any] = {}

    def get_path(self, arg: PathArg) -> Any:
        """Возвращает значение PathArg, кэшируя по строке пути."""
        if arg.path not in self._cache:
            self._cache[arg.path] = resolve_path(arg)
        return self._cache[arg.path]

    def invalidate(self) -> None:
        """Сбросить кэш — перед следующим вычислением."""
        self._cache.clear()

    def __contains__(self, path: str) -> bool:
        return path in self._cache

    def __len__(self) -> int:
        return len(self._cache)


# ============================================================
# Публичная точка входа
# ============================================================

def resolve_arg(
    arg: ExpressionArg,
    ctx: EvalContext | None = None,
) -> Any:
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
        # Когда появится движок ссылок — здесь будет:
        #   return evaluate_ref(arg.ref, ctx)
        raise NotImplementedError(
            f"RefArg пока не поддерживается: ref={arg.ref!r}"
        )

    raise TypeError(
        f"Неизвестный тип ExpressionArg: {type(arg).__name__}"
    )