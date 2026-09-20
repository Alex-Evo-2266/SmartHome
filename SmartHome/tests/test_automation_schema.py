
import pytest
from pydantic import ValidationError

from app.schemas.automation.automation_v4 import (
    AutomationSchema,
    BinaryExpr,
    UnaryExpr,
    CallExpr,
    GroupExpr,
    LiteralArg,
    RefArg,
    PathArg,
    WeeklyTimeTrigger,
    OnceTimeTrigger,
    MonthlyTimeTrigger,
    IntervalTimeTrigger,
    DelayStep,
    BinaryOp
)


# ============== Базовая валидация ==============

def test_minimal_valid_schema(make_automation):
    a = make_automation()
    assert a.id == "auto-1"
    assert a.schema_version == "1.0"
    assert a.is_enabled is True


def test_extra_fields_forbidden(make_automation):
    with pytest.raises(ValidationError):
        AutomationSchema(
            id="x", name="y", entry="s1",
            steps={"s1": {"type": "action", "device": "d", "command": "c"}},
            unexpected_field=1,  # type: ignore[call-arg]
        )


# ============== Ссылки ==============

def test_entry_not_found(make_automation):
    with pytest.raises(ValidationError) as exc:
        make_automation(entry="missing")
    assert "entry 'missing'" in str(exc.value)


def test_next_points_to_missing_step(make_automation):
    steps = {
        "s1": {"type": "action", "device": "d", "command": "c", "next": "ghost"},
    }
    with pytest.raises(ValidationError) as exc:
        make_automation(steps=steps)
    assert "ghost" in str(exc.value)


def test_condition_step_missing_targets(make_automation):
    steps = {
        "s1": {
            "type": "condition",
            "condition": {"type": "literal", "value": True},
            "on_true": "nope",
            "on_false": "also_nope",
        }
    }
    with pytest.raises(ValidationError) as exc:
        make_automation(steps=steps)
    msg = str(exc.value)
    assert "nope" in msg and "also_nope" in msg


def test_refarg_to_missing_expression(make_automation):
    steps = {
        "s1": {
            "type": "delay",
            "duration": {"type": "ref", "ref": "missing_expr"},
        }
    }
    with pytest.raises(ValidationError) as exc:
        make_automation(steps=steps)
    assert "missing_expr" in str(exc.value)


def test_refarg_pathlike_is_allowed(make_automation):
    steps = {
        "s1": {
            "type": "delay",
            "duration": {"type": "ref", "ref": "system.time"},
        }
    }
    a = make_automation(steps=steps)
    assert a.entry == "s1"


def test_refarg_in_expressions(make_automation):
    expressions = {
        "e1": {
            "type": "binary",
            "op": "add",
            "left": {"type": "ref", "ref": "missing"},
            "right": {"type": "literal", "value": 1},
        }
    }
    with pytest.raises(ValidationError) as exc:
        make_automation(expressions=expressions)
    assert "missing" in str(exc.value)


def test_refarg_in_trigger_condition(make_automation):
    trigger = {
        "type": "device",
        "device": "dev",
        "field": "brightness",
        "condition": {"type": "ref", "ref": "unknown_expr"},
    }
    with pytest.raises(ValidationError) as exc:
        make_automation(triggers=[trigger])
    assert "unknown_expr" in str(exc.value)


def test_valid_refs_pass(make_automation):
    expressions = {
        "e1": CallExpr(
            type="call",
            fn="const",
            args=[LiteralArg(type="literal", value=10)],
        ),
        "e2": BinaryExpr(
            type="binary",
            op=BinaryOp.EQ,
            left=RefArg(type="ref", ref="e1"),
            right=LiteralArg(type="literal", value=5),
        ),
    }
    steps = {
        "s1": DelayStep(
            type="delay",
            duration=RefArg(type="ref", ref="e1"),
        )
    }
    a = make_automation(expressions=expressions, steps=steps)
    assert "e1" in a.expressions


# ============== Триггеры времени ==============

def test_weekly_trigger_dedup_and_sort():
    t = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00",
        weekdays=[4, 0, 2, 4, 0],
    )
    assert t.weekdays == [0, 2, 4]


def test_weekly_trigger_out_of_range():
    with pytest.raises(ValidationError):
        WeeklyTimeTrigger(
            type="time", kind="weekly", at="10:00", weekdays=[7]
        )


def test_weekly_trigger_empty():
    with pytest.raises(ValidationError):
        WeeklyTimeTrigger(type="time", kind="weekly", at="10:00", weekdays=[])


def test_once_requires_timezone():
    with pytest.raises(ValidationError):
        OnceTimeTrigger(
            type="time", kind="once", run_at="2026-01-15T22:30:00"
        )


def test_once_with_tz_ok():
    t = OnceTimeTrigger(
        type="time", kind="once", run_at="2026-01-15T22:30:00+03:00"
    )
    assert t.run_at.endswith("+03:00")


def test_monthly_trigger():
    t = MonthlyTimeTrigger(
        type="time", kind="monthly", at="08:00", month_days=[1, 15, 31]
    )
    assert t.at == "08:00"


def test_interval_trigger():
    t = IntervalTimeTrigger(
        type="time", kind="interval", interval=30, unit="minutes"
    )
    assert t.unit == "minutes"