from types import SimpleNamespace

import pytest

from app.core.entities.automation.automation_context import AutomationContext
from app.core.entities.automation.automation_v4 import AutomationRunner
from app.core.entities.automation.blocks.expression_arg import resolve_arg
from app.schemas.automation.automation_v4 import (
    ActionStep,
    AutomationSchema,
    PathArg,
    PathParameter,
    ScriptParameter,
    ValueParameter,
)
from app.schemas.device.device import TypeDeviceField
from app.exceptions.device import DeviceNotFound
import app.core.entities.automation.blocks.pathArg as path_resolver


def make_automation(steps=None, parameters=None):
    if steps is None:
        steps = {
            "action": ActionStep(
                type="action",
                command="noop",
            )
        }
    return AutomationSchema(
        id="automation",
        name="test",
        entry="action",
        steps=steps,
        parameters=parameters or {},
    )


def path(value):
    return PathArg(type="path", path=value)


class FakeDeviceStore:
    def __init__(self, devices):
        self.devices = devices

    def get_snapshot(self, name):
        return self.devices.get(name)


class FakeRoomStore:
    def __init__(self, snapshots):
        self.snapshots = snapshots

    def get_all_snapshots(self):
        return self.snapshots


def device_snapshot(value=True, field_type=TypeDeviceField.BINARY):
    return SimpleNamespace(
        description=SimpleNamespace(
            fields=[SimpleNamespace(id="field", name="field", type=field_type)]
        ),
        state={"field": value},
    )


def room_snapshot(room="living_room", devices=None):
    return SimpleNamespace(
        room=room,
        devices=devices or [
            SimpleNamespace(type_name="sensor", state={"temperature": "21.5"})
        ],
    )


def patch_stores(monkeypatch, devices=None, rooms=None):
    container = SimpleNamespace(
        device_store=FakeDeviceStore(devices or {}),
        room_store=FakeRoomStore(rooms or []),
    )
    monkeypatch.setattr(path_resolver, "get_container", lambda: container)
    return container


def test_plain_variable_returns_original_value():
    ctx = AutomationContext(make_automation(), {"count": 12})

    assert resolve_arg(path("variable.count"), ctx) == 12


def test_declared_parameter_default_is_available_as_variable(monkeypatch):
    patch_stores(monkeypatch, devices={"dev": device_snapshot("1")})
    automation = make_automation(
        parameters={
            "target": ScriptParameter(
                title="Target",
                required=False,
                definition=PathParameter(default="device.dev.field"),
            )
        }
    )
    ctx = AutomationContext(automation)

    assert resolve_arg(path("variable.target"), ctx) is True


def test_declared_parameter_rejects_value_of_wrong_type():
    automation = make_automation(
        parameters={
            "count": ScriptParameter(
                title="Count",
                required=False,
                definition=ValueParameter(type="number"),
            )
        }
    )

    with pytest.raises(ValueError, match="не соответствует типу"):
        AutomationContext(automation, {"count": "not a number"})


def test_variable_device_reference_resolves_field(monkeypatch):
    patch_stores(monkeypatch, devices={"dev": device_snapshot("1")})
    ctx = AutomationContext(make_automation(), {"target": "device.dev.field"})

    assert resolve_arg(path("variable.target"), ctx) is True


def test_variable_room_reference_resolves_field(monkeypatch):
    patch_stores(monkeypatch, rooms=[room_snapshot()])
    ctx = AutomationContext(
        make_automation(),
        {"temperature": "room.living_room.temperature"},
    )

    assert resolve_arg(path("variable.temperature"), ctx) == "21.5"


@pytest.mark.asyncio
async def test_action_path_variable_returns_reference_without_reading_resource(monkeypatch):
    def fail_if_read():
        raise AssertionError("stepAction.path must not read the resource")

    monkeypatch.setattr(path_resolver, "get_container", fail_if_read)
    action = ActionStep(
        type="action",
        command="set_value",
        params={"path": path("variable.target")},
    )
    automation = make_automation({"action": action})
    calls = []

    async def handler(command, params):
        calls.append((command, params))

    await AutomationRunner(handler).run(
        automation,
        variables={"target": "device.dev.field"},
    )

    assert calls == [("set_value", {"path": "device.dev.field"})]


@pytest.mark.asyncio
async def test_action_value_variable_resolves_to_ordinary_value():
    action = ActionStep(
        type="action",
        command="set_value",
        params={"value": path("variable.enabled")},
    )
    automation = make_automation({"action": action})
    calls = []

    async def handler(command, params):
        calls.append(params)

    await AutomationRunner(handler).run(
        automation,
        variables={"enabled": True},
    )

    assert calls == [{"value": True}]


@pytest.mark.asyncio
async def test_action_path_and_value_are_resolved_independently(monkeypatch):
    patch_stores(monkeypatch, devices={"dev": device_snapshot("1")})
    action = ActionStep(
        type="action",
        command="set_value",
        params={
            "path": path("variable.target"),
            "value": path("variable.current_value"),
        },
    )
    automation = make_automation({"action": action})
    calls = []

    async def handler(command, params):
        calls.append(params)

    await AutomationRunner(handler).run(
        automation,
        variables={
            "target": "device.dev.field",
            "current_value": "device.dev.field",
        },
    )

    assert calls == [{"path": "device.dev.field", "value": True}]


def test_nested_variable_references_resolve(monkeypatch):
    patch_stores(monkeypatch, devices={"dev": device_snapshot("1")})
    ctx = AutomationContext(
        make_automation(),
        {
            "first": "variable.second",
            "second": "device.dev.field",
        },
    )

    assert resolve_arg(path("variable.first"), ctx) is True


def test_missing_variable_raises():
    ctx = AutomationContext(make_automation())

    with pytest.raises(ValueError, match="Переменная не найдена"):
        resolve_arg(path("variable.missing"), ctx)


def test_invalid_variable_reference_path_raises():
    ctx = AutomationContext(make_automation(), {"target": "device..field"})

    with pytest.raises(ValueError, match="Неверный device-путь"):
        resolve_arg(path("variable.target"), ctx)


def test_missing_device_reference_raises(monkeypatch):
    patch_stores(monkeypatch)
    ctx = AutomationContext(make_automation(), {"target": "device.missing.field"})

    with pytest.raises(DeviceNotFound):
        resolve_arg(path("variable.target"), ctx)


def test_missing_room_reference_raises(monkeypatch):
    patch_stores(monkeypatch)
    ctx = AutomationContext(
        make_automation(),
        {"target": "room.missing.temperature"},
    )

    with pytest.raises(ValueError, match="Комната не найдена"):
        resolve_arg(path("variable.target"), ctx)


def test_cyclic_variable_references_raise():
    ctx = AutomationContext(
        make_automation(),
        {"first": "variable.second", "second": "variable.first"},
    )

    with pytest.raises(ValueError, match="Циклическая ссылка переменных"):
        resolve_arg(path("variable.first"), ctx)


def test_direct_device_and_room_paths_still_resolve(monkeypatch):
    patch_stores(
        monkeypatch,
        devices={"dev": device_snapshot("1")},
        rooms=[
            room_snapshot(
                devices=[
                    SimpleNamespace(
                        type_name="sensor",
                        state={"temperature": "21.5"},
                    )
                ]
            )
        ],
    )
    ctx = AutomationContext(make_automation())

    assert resolve_arg(path("device.dev.field"), ctx) is True
    assert resolve_arg(path("room.living_room.sensor.temperature"), ctx) == "21.5"
