import pytest
from app.schemas.automation.automation_v4 import (
    AutomationSchema,
    WeeklyTimeTrigger,
    MonthlyTimeTrigger,
    OnceTimeTrigger,
    DeviceTrigger,
    RoomTrigger,
    ActionStep,
    DelayStep,
    ConditionStep,
    AwaitStep,
    BinaryExpr,
    UnaryExpr,
    CallExpr,
    GroupExpr,
    LiteralArg,
    RefArg,
    PathArg,
    Step
)


@pytest.fixture
def make_automation():
    """Фабрика валидных автоматизаций с разумными дефолтами."""

    def _make(
        id: str = "auto-1",
        name: str = "Test Auto",
        triggers=None,
        steps:dict[str, Step] | None = None,
        expressions=None,
        entry: str = "s1",
    ) -> AutomationSchema:
        if steps is None:
            steps = {
                "s1": ActionStep(
                    type="action",
                    device="dev1",
                    command="turn_on",
                ),
            }
        return AutomationSchema(
            id=id,
            name=name,
            trigger=triggers or [],
            entry=entry,
            steps=steps,
            expressions=expressions or {},
        )

    return _make


@pytest.fixture
def weekly_trigger():
    return WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0, 2, 4]
    )


@pytest.fixture
def monthly_trigger():
    return MonthlyTimeTrigger(
        type="time", kind="monthly", at="10:00", month_days=[1, 15]
    )


@pytest.fixture
def once_trigger():
    return OnceTimeTrigger(
        type="time", kind="once", run_at="2026-01-15T22:30:00+03:00"
    )


@pytest.fixture
def device_trigger():
    return DeviceTrigger(type="device", device="dev1", field="brightness")


@pytest.fixture
def room_trigger():
    return RoomTrigger(
        type="room", room="kitchen", device_type="light", field="brightness"
    )


# ============================================================
# Отображение "блока" в консоли pytest
# ============================================================
# Маркер → короткий тег, который подставляется перед именем теста.
_TAG_BY_MARKER = {
    "device":   "DEVICE",
    "system":   "SYSTEM",
    "variable": "VARIABLE",
    "binary":   "BINARY",
    "number":   "NUMBER",
    "literal":  "LITERAL",
    "manager":  "MANAGER",
    "schema":   "SCHEMA",
}


def pytest_collection_modifyitems(config, items):
    """Префиксует nodeid теста тегом по первому известному маркеру."""
    for item in items:
        for mark in item.iter_markers():
            tag = _TAG_BY_MARKER.get(mark.name)
            if tag:
                item._nodeid = f"[{tag}] {item._nodeid}"
                break