
from typing import Any
from app.pkg.logger import get_automatization
from app.schemas.automation.automation_v4 import (
    CommandHandler,
    CommandParameter,
    DeviceCommand,
    Target,
)
from app.core.services.device.set_status import set_status_by_name_field_correct
from app.core.entities.room.set_value_room import set_value_room

logger = get_automatization.get_logger(__name__)

COMMANDS: dict[str, DeviceCommand] = {}
HANDLERS: dict[str, CommandHandler] = {}


def register_command(
    command: DeviceCommand,
    handler: CommandHandler,
) -> None:
    if command.name in COMMANDS:
        raise ValueError(
            f"Команда '{command.name}' уже зарегистрирована"
        )

    COMMANDS[command.name] = command
    HANDLERS[command.name] = handler




async def set_value_handler(
    params: dict[str, Any],
) -> None:
    path = validate_path_parameter(params)
    path_segments = path.split(".")
    values = {name: value for name, value in params.items() if name != "path"}
    if any(not isinstance(name, str) or not name.strip() for name in values):
        raise ValueError("Имена параметров команды должны быть непустыми строками")

    is_bulk_update = (
        (path_segments[0] == "device" and len(path_segments) == 2)
        or (path_segments[0] == "room" and len(path_segments) == 3)
    )
    if is_bulk_update:
        if not values:
            raise ValueError(
                f"Команда 'set_value' требует хотя бы один параметр "
                f"для пути {path!r}"
            )
        if any(value is None for value in values.values()):
            raise ValueError(f"Значения команды 'set_value' не могут быть None: {values}")
    else:
        unknown_parameters = values.keys() - {"value"}
        if unknown_parameters:
            raise ValueError(
                "Неизвестные параметры команды 'set_value': "
                f"{', '.join(sorted(unknown_parameters))}"
            )
        if "value" not in values:
            raise ValueError(
                "Отсутствует обязательный параметр 'value' команды 'set_value'"
            )
        if values["value"] is None:
            raise ValueError("Параметр 'value' команды 'set_value' не может быть None")

    if path_segments[0] == 'device':
        if len(path_segments) == 3:
            val = values["value"]
            await set_status_by_name_field_correct(path_segments[1], path_segments[2], val)
        elif len(path_segments) == 2:
            for key, val in values.items():
                await set_status_by_name_field_correct(path_segments[1], key, val)
    elif path_segments[0] == 'room':
        if len(path_segments) == 4:
            val = values["value"]
            await set_value_room(path_segments[1], path_segments[2], path_segments[3], val)
        elif len(path_segments) == 3:
            for key, val in values.items():
                await set_value_room(path_segments[1], path_segments[2], key, val)


def validate_path_parameter(params: dict[str, Any]) -> str:
    if "path" not in params:
        raise ValueError("В параметрах команды отсутствует обязательный путь 'path'")

    path = params.get("path")
    if not isinstance(path, str) or not path.strip():
        raise ValueError("Путь команды устройства должен быть непустой строкой")

    path_segments = path.split(".")
    valid_device_path = (
        path_segments[0] == "device" and len(path_segments) in (2, 3)
    )
    valid_room_path = path_segments[0] == "room" and len(path_segments) in (3, 4)
    if (
        any(not segment for segment in path_segments)
        or not (valid_device_path or valid_room_path)
    ):
        raise ValueError(f"Некорректный путь команды: {path!r}")

    return path


register_command(
    DeviceCommand(
        name="set_value",
        title="Установить значение",
        description="Устанавливает значение поля устройства.",
        target=Target.FIELD_DEVICE,
        parameters=[
            CommandParameter(
                name="path",
                title="path",
                data_type="path",
            ),
            CommandParameter(
                name="value",
                title="value",
                data_type="for_path",
            ),
        ],
    ),
    set_value_handler,
)

async def device_action_handler(
    command: str,
    params: dict[str, Any],
) -> None:
    if not isinstance(command, str) or not command.strip():
        raise ValueError("Команда устройства должна быть непустой строкой")
    if not isinstance(params, dict):
        raise ValueError("Параметры команды устройства должны быть словарём")

    handler = HANDLERS.get(command)
    if handler is None:
        raise ValueError(
            f"Неизвестная команда устройства: {command}"
        )

    logger.debug("Run action handler %s (%s)", command, params)
    await handler(params)

def get_action_commands():
    return list(COMMANDS.values())