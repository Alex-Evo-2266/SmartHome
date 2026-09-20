import asyncio
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import pytest
from freezegun import freeze_time

from app.core.state.automation_store_v4 import AutomationManager_V4
from app.schemas.automation.automation_v4 import (
    WeeklyTimeTrigger,
    MonthlyTimeTrigger,
    OnceTimeTrigger,
    DeviceTrigger,
    RoomTrigger,
)


# ============== Вспомогательные ==============

def _device_patch(system_name: str, changes: dict) -> MagicMock:
    p = MagicMock()
    p.system_name = system_name
    p.changes = changes
    return p


def _room_patch(room: str, type_name: str, changes: dict) -> MagicMock:
    p = MagicMock()
    p.room = room
    p.type_name = type_name
    p.changes = changes
    return p


# ============== add / remove / clear ==============

def test_add_automation(make_automation, weekly_trigger):
    mgr = AutomationManager_V4()
    aut = make_automation(id="a1", triggers=[weekly_trigger])
    assert mgr.add_automation(aut) is True
    assert "a1" in mgr.automations


def test_add_duplicate(make_automation):
    mgr = AutomationManager_V4()
    aut = make_automation(id="a1")
    assert mgr.add_automation(aut) is True
    assert mgr.add_automation(aut) is False


def test_remove_automation(make_automation, weekly_trigger):
    mgr = AutomationManager_V4()
    aut = make_automation(id="a1", triggers=[weekly_trigger])
    mgr.add_automation(aut)
    assert mgr.remove_automation("a1") is True
    assert "a1" not in mgr.automations
    # индексы очищены
    for bucket in mgr.weekly.values():
        assert "a1" not in bucket.data


def test_remove_unknown():
    mgr = AutomationManager_V4()
    assert mgr.remove_automation("nope") is False


def test_clear_automations(make_automation, weekly_trigger, device_trigger):
    mgr = AutomationManager_V4()
    mgr.add_automation(make_automation(id="a1", triggers=[weekly_trigger]))
    mgr.add_automation(make_automation(id="a2", triggers=[device_trigger]))
    mgr.clear_automations()
    assert mgr.automations == {}
    assert mgr.weekly == {}
    assert mgr.device_index == {}
    assert mgr.last_run_time is None


# ============== Индексация времени ==============

def test_index_weekly(make_automation):
    mgr = AutomationManager_V4()
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="22:30:00", weekdays=[0, 2, 4]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))
    for wd in (0, 2, 4):
        key = (wd, "22:30")
        assert key in mgr.weekly
        assert "a1" in mgr.weekly[key].data


def test_index_monthly(make_automation):
    mgr = AutomationManager_V4()
    trg = MonthlyTimeTrigger(
        type="time", kind="monthly", at="08:15", month_days=[1, 15]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))
    assert "a1" in mgr.monthly[(1, "08:15")].data
    assert "a1" in mgr.monthly[(15, "08:15")].data


def test_index_once_normalizes_to_utc(make_automation):
    mgr = AutomationManager_V4()
    trg = OnceTimeTrigger(
        type="time", kind="once", run_at="2026-01-15T22:30:00+03:00"
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))
    # 22:30 +03:00 => 19:30 UTC
    assert "2026-01-15T19:30" in mgr.once


def test_unindex_weekly(make_automation):
    mgr = AutomationManager_V4()
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))
    mgr.remove_automation("a1")
    assert (0, "10:00") not in mgr.weekly


# ============== Индексация device / room ==============

def test_index_device(make_automation, device_trigger):
    mgr = AutomationManager_V4()
    mgr.add_automation(make_automation(id="a1", triggers=[device_trigger]))
    key = ("dev1", "brightness")
    assert key in mgr.device_index
    assert "a1" in mgr.device_index[key].data


def test_index_room(make_automation, room_trigger):
    mgr = AutomationManager_V4()
    mgr.add_automation(make_automation(id="a1", triggers=[room_trigger]))
    key = ("kitchen", "light", "brightness")
    assert "a1" in mgr.room_index[key].data


# ============== _get_due_automations ==============

def test_get_due_weekly(make_automation):
    mgr = AutomationManager_V4()
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    monday = datetime(2026, 1, 5, 10, 0, tzinfo=timezone.utc)  # Monday
    due = mgr._get_due_automations(monday)
    assert "a1" in due


def test_get_due_prevents_double_run_within_60s(make_automation):
    mgr = AutomationManager_V4()
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    monday = datetime(2026, 1, 5, 10, 0, tzinfo=timezone.utc)
    due1 = mgr._get_due_automations(monday)
    due2 = mgr._get_due_automations(monday)
    assert "a1" in due1
    assert due2 == []


def test_get_due_once(make_automation):
    mgr = AutomationManager_V4()
    trg = OnceTimeTrigger(
        type="time", kind="once", run_at="2026-01-15T19:30:00+00:00"
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    moment = datetime(2026, 1, 15, 19, 30, tzinfo=timezone.utc)
    assert "a1" in mgr._get_due_automations(moment)


def test_get_due_monthly(make_automation):
    mgr = AutomationManager_V4()
    trg = MonthlyTimeTrigger(
        type="time", kind="monthly", at="10:00", month_days=[5]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))
    moment = datetime(2026, 3, 5, 10, 0, tzinfo=timezone.utc)
    assert "a1" in mgr._get_due_automations(moment)


# ============== run_due_automations (интеграция) ==============

@pytest.mark.asyncio
@freeze_time("2026-01-05 10:00:00")  # Monday 10:00 UTC
async def test_run_due_calls_callback(make_automation):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    await mgr.run_due_automations()
    assert called == ["a1"]


@pytest.mark.asyncio
@freeze_time("2026-01-05 10:00:00")
async def test_run_due_does_not_run_twice(make_automation):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    await mgr.run_due_automations()
    await mgr.run_due_automations()
    assert called.count("a1") == 1


@pytest.mark.asyncio
@freeze_time("2026-01-05 11:00:00")
async def test_run_due_ignores_wrong_time(make_automation):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    await mgr.run_due_automations()
    assert called == []


@pytest.mark.asyncio
@freeze_time("2026-01-05 10:00:00")
async def test_callback_exception_is_logged_not_raised(make_automation):
    async def bad_cb(_aut):
        raise RuntimeError("boom")

    mgr = AutomationManager_V4(callback=bad_cb)
    trg = WeeklyTimeTrigger(
        type="time", kind="weekly", at="10:00", weekdays=[0]
    )
    mgr.add_automation(make_automation(id="a1", triggers=[trg]))

    # не должно бросить
    await mgr.run_due_automations()


# ============== on_device_patch ==============

@pytest.mark.asyncio
async def test_on_device_patch_triggers(make_automation, device_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[device_trigger]))

    await mgr.on_device_patch(_device_patch("dev1", {"brightness": 50}))
    assert called == ["a1"]


@pytest.mark.asyncio
async def test_on_device_patch_ignores_unrelated_field(make_automation, device_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[device_trigger]))

    await mgr.on_device_patch(_device_patch("dev1", {"color": "red"}))
    assert called == []


@pytest.mark.asyncio
async def test_on_device_patch_ignores_other_device(make_automation, device_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[device_trigger]))

    await mgr.on_device_patch(_device_patch("dev999", {"brightness": 50}))
    assert called == []


# ============== on_room_patch ==============

@pytest.mark.asyncio
async def test_on_room_patch_triggers(make_automation, room_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[room_trigger]))

    await mgr.on_room_patch(_room_patch("kitchen", "light", {"brightness": 20}))
    assert called == ["a1"]


@pytest.mark.asyncio
async def test_on_room_patch_wrong_room(make_automation, room_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[room_trigger]))

    await mgr.on_room_patch(_room_patch("bedroom", "light", {"brightness": 20}))
    assert called == []


@pytest.mark.asyncio
async def test_on_room_patch_wrong_type(make_automation, room_trigger):
    called = []

    async def cb(aut):
        called.append(aut.id)

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[room_trigger]))

    await mgr.on_room_patch(_room_patch("kitchen", "sensor", {"brightness": 20}))
    assert called == []


# ============== Реентерабельность ==============

@pytest.mark.asyncio
async def test_device_patch_does_not_reenter(make_automation, device_trigger):
    """Пока автоматизация в _running_automations — повторный патч не запускает её."""
    running = asyncio.Event()
    release = asyncio.Event()
    call_count = 0

    async def cb(_aut):
        nonlocal call_count
        call_count += 1
        running.set()
        await release.wait()

    mgr = AutomationManager_V4(callback=cb)
    mgr.add_automation(make_automation(id="a1", triggers=[device_trigger]))

    task = asyncio.create_task(
        mgr.on_device_patch(_device_patch("dev1", {"brightness": 1}))
    )
    await running.wait()
    # Второй патч во время выполнения — не должен увеличить call_count
    await mgr.on_device_patch(_device_patch("dev1", {"brightness": 2}))
    release.set()
    await task

    assert call_count == 1