# app/core/entities/automation/automation_context.py
from __future__ import annotations

from typing import Any

from app.schemas.automation.automation_v4 import (
    Step, Expression, AutomationSchema, PathArg,
)
from app.core.entities.automation.blocks.pathArg import resolve_path


# Сентинел — «в кэше нет значения». Отличим от None.
_NOT_CACHED = object()


class ExpressionError(Exception):
    """Ошибка вычисления выражения — с человекочитаемым сообщением."""


class AutomationContext:
    """
    Контекст одного запуска сценария.

    Хранит:
      - steps, expressions — из AutomationSchema
      - _path_cache        — значения PathArg (device.*, system.*)
      - _expr_cache        — вычисленные значения Expression по id
      - _evaluating        — id выражений, которые сейчас в стеке (для циклов)
      - _depth             — текущая глубина рекурсии
    """

    MAX_DEPTH = 64

    __slots__ = (
        "steps", "expressions",
        "_path_cache", "_expr_cache",
        "_evaluating", "_depth",
    )

    def __init__(self, automation: AutomationSchema) -> None:
        self.steps: dict[str, Step] = automation.steps
        self.expressions: dict[str, Expression] = automation.expressions

        self._path_cache: dict[str, Any] = {}
        self._expr_cache: dict[str, Any] = {}
        self._evaluating: set[str] = set()
        self._depth: int = 0

    # ---------- steps / expressions ----------

    def get_steps(self) -> dict[str, Step]:
        return self.steps

    def get_expressions(self) -> dict[str, Expression]:
        return self.expressions

    def get_step(self, key: str) -> Step | None:
        return self.steps.get(key)

    def get_expression(self, key: str) -> Expression | None:
        return self.expressions.get(key)

    def set_step(self, key: str, value: Step) -> None:
        self.steps[key] = value

    def set_expression(self, key: str, value: Expression) -> None:
        self.expressions[key] = value

    # ---------- PathArg cache ----------

    def get_path(self, arg: PathArg) -> Any:
        if arg.path not in self._path_cache:
            self._path_cache[arg.path] = resolve_path(arg)
        return self._path_cache[arg.path]

    # ---------- Expression cache ----------

    def get_expr_cached(self, expr_id: str) -> Any:
        """Возвращает закэшированное значение или _NOT_CACHED."""
        return self._expr_cache.get(expr_id, _NOT_CACHED)

    def set_expr_cached(self, expr_id: str, value: Any) -> None:
        self._expr_cache[expr_id] = value

    # ---------- Cycle / depth ----------

    def enter_expr(self, expr_id: str) -> None:
        """Вызывается перед вычислением выражения. Ловит циклы и глубину."""
        if expr_id in self._evaluating:
            chain = " → ".join([*self._evaluating, expr_id])
            raise ExpressionError(
                f"Циклическая зависимость выражений: {chain}"
            )
        if self._depth >= self.MAX_DEPTH:
            raise ExpressionError(
                f"Превышена максимальная глубина выражений "
                f"({self.MAX_DEPTH}). Проверьте цепочку ref-ов."
            )
        self._evaluating.add(expr_id)
        self._depth += 1

    def exit_expr(self, expr_id: str) -> None:
        """Вызывается после вычисления выражения (в finally)."""
        self._evaluating.discard(expr_id)
        self._depth -= 1

    # ---------- Lifecycle ----------

    def invalidate(self) -> None:
        """
        Сбрасывает все кэши. Вызывать между шагами сценария —
        чтобы увидеть актуальное состояние стора после delay / await.
        """
        self._path_cache.clear()
        self._expr_cache.clear()
        self._evaluating.clear()
        self._depth = 0

    def __contains__(self, path: str) -> bool:
        return path in self._path_cache

    def __len__(self) -> int:
        return len(self._path_cache)