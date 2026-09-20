from enum import Enum
from typing import Annotated, Optional, Literal, Union

from pydantic import BaseModel, Field, ConfigDict, model_validator, field_validator

from datetime import datetime

class Weekday(int, Enum):
    MON = 0
    TUE = 1
    WED = 2
    THU = 3
    FRI = 4
    SAT = 5
    SUN = 6


# ============================================================
# Операторы
# ============================================================

class BinaryOp(str, Enum):
    EQ = "eq"
    NE = "ne"
    LT = "lt"
    LTE = "lte"
    GT = "gt"
    GTE = "gte"
    ADD = "add"
    SUB = "sub"
    MUL = "mul"
    DIV = "div"
    MOD = "mod"
    POW = "pow"
    CONCAT = "concat"
    BEFORE = "before"
    AFTER = "after"


class UnaryOp(str, Enum):
    NOT = "not"
    NEG = "neg"


class GroupOp(str, Enum):
    AND = "and"
    OR = "or"
    ADD = "add"
    MUL = "mul"


# ============================================================
# Аргументы выражений
# ============================================================

class LiteralArg(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["literal"]
    value: Union[int, float, str, bool, None] = None
    data_type: Optional[Literal[
        "number", "string", "boolean", "time", "duration"
    ]] = None


class RefArg(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["ref"]
    ref: str  # id другого выражения


class PathArg(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["path"]
    path: str  # "device.light_hall.brightness" или "system.time"


ExpressionArg = Annotated[
    Union[LiteralArg, RefArg, PathArg],
    Field(discriminator="type"),
]


# ============================================================
# Выражения (AST)
# ============================================================

class BinaryExpr(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["binary"]
    op: BinaryOp
    left: ExpressionArg
    right: ExpressionArg


class UnaryExpr(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["unary"]
    op: UnaryOp
    operand: ExpressionArg


class CallExpr(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["call"]
    fn: str
    args: list[ExpressionArg] = Field(default_factory=list)


class GroupExpr(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["group"]
    op: GroupOp
    items: list[ExpressionArg] = Field(default_factory=list)


Expression = Annotated[
    Union[BinaryExpr, UnaryExpr, CallExpr, GroupExpr],
    Field(discriminator="type"),
]


# ============================================================
# Триггеры
# ============================================================


class OnceTimeTrigger(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["time"]
    kind: Literal["once"]
    run_at: str              # "2026-01-15T22:30:00+03:00"
    timezone: Optional[str] = None

    @field_validator("run_at")
    @classmethod
    def require_tz(cls, v: str) -> str:
        dt = datetime.fromisoformat(v)
        if dt.tzinfo is None:
            raise ValueError("run_at должен содержать часовой пояс, например '+03:00' или 'Z'")
        return v

class WeeklyTimeTrigger(BaseModel):
    """Единый триггер: работает по выбранным дням недели."""
    model_config = ConfigDict(extra="forbid")

    type: Literal["time"]
    kind: Literal["weekly"]

    at: str                          # "22:30" или "22:30:00"
    weekdays: list[int] = Field(..., min_length=1, max_length=7)
    timezone: Optional[str] = None

    active_from: Optional[str] = None
    active_until: Optional[str] = None

    @model_validator(mode="after")
    def check_weekdays(self):
        if any(d < 0 or d > 6 for d in self.weekdays):
            raise ValueError("weekdays: числа должны быть от 0 (Пн) до 6 (Вс)")
        # убрать дубли
        self.weekdays = sorted(set(self.weekdays))
        return self

class MonthlyTimeTrigger(BaseModel):
    type: Literal["time"]
    kind: Literal["monthly"]
    at: str
    month_days: list[int]
    timezone: Optional[str] = None

class IntervalTimeTrigger(BaseModel):
    type: Literal["time"]
    kind: Literal["interval"]
    interval: int
    unit: Literal["seconds", "minutes", "hours", "days"]
    timezone: Optional[str] = None

TimeTrigger = Annotated[
    Union[OnceTimeTrigger, WeeklyTimeTrigger,
          MonthlyTimeTrigger, IntervalTimeTrigger],
    Field(discriminator="kind"),
]

class DeviceTrigger(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["device"]
    device: str
    field: str
    condition: Optional[RefArg]

class RoomTrigger(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["room"]
    room: str
    device_type: str
    field: str
    condition: Optional[RefArg]


Trigger = Annotated[
    Union[DeviceTrigger, TimeTrigger, RoomTrigger],
    Field(discriminator="type"),
]


# ============================================================
# Шаги
# ============================================================

class DelayStep(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["delay"]
    duration: ExpressionArg
    label: Optional[str] = None
    next: Optional[str] = None


class ActionStep(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["action"]
    device: str
    command: str
    params: dict[str, ExpressionArg] = Field(default_factory=dict)
    label: Optional[str] = None
    next: Optional[str] = None


class ConditionStep(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["condition"]
    condition: ExpressionArg
    on_true: Optional[str] = None
    on_false: Optional[str] = None
    label: Optional[str] = None
    next: Optional[str] = None  # после обеих веток


class AwaitStep(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    type: Literal["await"]
    condition: ExpressionArg
    timeout: Optional[ExpressionArg] = None
    on_timeout: Optional[str] = None
    label: Optional[str] = None
    next: Optional[str] = None


Step = Annotated[
    Union[DelayStep, ActionStep, ConditionStep, AwaitStep],
    Field(discriminator="type"),
]


# ============================================================
# Корневая модель
# ============================================================

class AutomationSchema(BaseModel):
    model_config = ConfigDict(extra="forbid", use_enum_values=True)

    schema_version: str = "1.0"
    id: str
    name: str
    description: Optional[str] = None

    trigger: list[Trigger] = Field(default_factory=list)
    entry: str

    steps: dict[str, Step] = Field(default_factory=dict)
    expressions: dict[str, Expression] = Field(default_factory=dict)

    is_enabled: bool = True

    # ---------- Валидация ссылок ----------
    @model_validator(mode="after")
    def check_references(self):
        errors: list[str] = []

        step_ids = set(self.steps.keys())
        expr_ids = set(self.expressions.keys())

        # entry существует
        if self.entry not in step_ids:
            errors.append(f"entry '{self.entry}' не найден в steps")

        # next / on_true / on_false / on_timeout
        for sid, step in self.steps.items():
            for field in ("next", "on_true", "on_false", "on_timeout"):
                target = getattr(step, field, None)
                if target is not None and target not in step_ids:
                    errors.append(
                        f"Шаг '{sid}': поле '{field}' ссылается на "
                        f"несуществующий шаг '{target}'"
                    )

        # Обход RefArg
        def walk(arg: ExpressionArg, ctx: str) -> None:
            if isinstance(arg, RefArg):
                if arg.ref not in expr_ids and "." not in arg.ref:
                    errors.append(
                        f"{ctx}: ref '{arg.ref}' не найден в expressions "
                        f"и не похож на path"
                    )

        # RefArg внутри выражений
        for eid, expr in self.expressions.items():
            if isinstance(expr, BinaryExpr):
                walk(expr.left, f"expr '{eid}' (left)")
                walk(expr.right, f"expr '{eid}' (right)")
            elif isinstance(expr, UnaryExpr):
                walk(expr.operand, f"expr '{eid}' (operand)")
            elif isinstance(expr, CallExpr):
                for i, a in enumerate(expr.args):
                    walk(a, f"expr '{eid}' (arg #{i})")
            elif isinstance(expr, GroupExpr):
                for i, a in enumerate(expr.items):
                    walk(a, f"expr '{eid}' (item #{i})")

        # RefArg внутри шагов
        for sid, step in self.steps.items():
            args_to_check: list[ExpressionArg] = []

            if isinstance(step, ActionStep):
                args_to_check.extend(step.params.values())
            elif isinstance(step, DelayStep):
                args_to_check.append(step.duration)
            elif isinstance(step, ConditionStep):
                args_to_check.append(step.condition)
            elif isinstance(step, AwaitStep):
                args_to_check.append(step.condition)
                if step.timeout is not None:
                    args_to_check.append(step.timeout)

            for a in args_to_check:
                walk(a, f"step '{sid}'")

        # RefArg внутри триггеров
        for i, trg in enumerate(self.trigger):
            if isinstance(trg, (DeviceTrigger, RoomTrigger)):
                if trg.condition is not None:
                    walk(trg.condition, f"trigger #{i}")

        if errors:
            raise ValueError("; ".join(errors))

        return self


# ============================================================
# Обёртки для API
# ============================================================

class AutomationResponseSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    data: list[AutomationSchema]


class EnableSchema(BaseModel):
    model_config = ConfigDict(extra="forbid")

    is_enabled: bool = True