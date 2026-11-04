import inspect
from unittest.mock import AsyncMock, patch

import pytest

from app.core.entities.automation.device_action_handler import (
    COMMANDS,
    HANDLERS,
    device_action_handler,
)
from app.schemas.automation.automation_v4 import (
    CommandParameter,
    DeviceCommand,
    Target,
)


@pytest.mark.asyncio
async def test_device_action_handler_extracts_path_from_params():
    with patch(
        "app.core.entities.automation.device_action_handler."
        "set_status_by_name_field_correct",
        new_callable=AsyncMock,
    ) as set_value:
        await device_action_handler(
            command="set_value",
            params={"path": "device.lamp.state", "value": True},
        )

    set_value.assert_awaited_once_with("lamp", "state", True)


@pytest.mark.asyncio
async def test_device_action_handler_bulk_update_excludes_path_from_values():
    with patch(
        "app.core.entities.automation.device_action_handler."
        "set_status_by_name_field_correct",
        new_callable=AsyncMock,
    ) as set_value:
        await device_action_handler(
            command="set_value",
            params={"path": "device.lamp", "state": True},
        )

    set_value.assert_awaited_once_with("lamp", "state", True)


@pytest.mark.parametrize(
    ("command", "params", "message"),
    [
        ("set_value", {"value": True}, "отсутствует обязательный путь"),
        ("set_value", {"path": 1, "value": True}, "Путь команды"),
        ("set_value", {"path": "  ", "value": True}, "Путь команды"),
        ("set_value", {"path": "device.lamp..state", "value": True}, "Некорректный путь"),
        ("set_value", {"path": "device.lamp.state"}, "обязательный параметр"),
        (
            "set_value",
            {"path": "device.lamp.state", "value": True, "extra": 1},
            "Неизвестные параметры",
        ),
        ("missing", {"path": "device.lamp.state"}, "Неизвестная команда"),
        ("", {"path": "device.lamp.state"}, "Команда устройства"),
        ("set_value", [], "должны быть словарём"),
    ],
)
@pytest.mark.asyncio
async def test_device_action_handler_rejects_invalid_input(command, params, message):
    with pytest.raises(ValueError, match=message):
        await device_action_handler(command=command, params=params)


@pytest.mark.asyncio
async def test_device_action_handler_allows_commands_without_path(monkeypatch):
    received = []

    async def handler(params):
        received.append(params)

    command = DeviceCommand(
        name="pathless",
        title="Pathless command",
        target=Target.DEVICE,
    )
    monkeypatch.setitem(COMMANDS, command.name, command)
    monkeypatch.setitem(HANDLERS, command.name, handler)

    await device_action_handler(command="pathless", params={"enabled": True})

    assert received == [{"enabled": True}]


def test_set_value_command_declares_path_as_a_parameter():
    path_parameter = COMMANDS["set_value"].parameters[0]

    assert path_parameter == CommandParameter(
        name="path",
        title="path",
        data_type="path",
    )


def test_device_action_handler_signature_has_no_separate_path_argument():
    assert list(inspect.signature(device_action_handler).parameters) == [
        "command",
        "params",
    ]


@pytest.mark.asyncio
async def test_device_action_handler_propagates_execution_errors():
    with patch(
        "app.core.entities.automation.device_action_handler."
        "set_status_by_name_field_correct",
        new_callable=AsyncMock,
        side_effect=RuntimeError("device unavailable"),
    ):
        with pytest.raises(RuntimeError, match="device unavailable"):
            await device_action_handler(
                command="set_value",
                params={"path": "device.lamp.state", "value": True},
            )
