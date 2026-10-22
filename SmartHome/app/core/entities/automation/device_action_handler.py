
from typing import Any
from app.pkg.logger import get_automatization
from app.schemas.automation.automation_v4 import DeviceCommand, CommandHandler, CommandParameter
from app.core.services.device.set_status import set_status_by_name_field_correct
from app.core.entities.room.set_value_room import set_value_room

logger = get_automatization.get_logger(__name__)

from typing import Any

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
    path: str,
    params: dict[str, Any],
) -> None:
    path_segments = path.split('.')
    if path_segments[0] == 'device':
        if len(path_segments) == 3:
            val = params.get('value')
            if val is None:
                logger.warning(f"invalid value params device {val}. obj, {params}")
                raise ValueError(f"invalid value params device {val}. obj, {params}")
            await set_status_by_name_field_correct(path_segments[1], path_segments[2], val)
        elif len(path_segments) == 2:
            for key, val in params.items():
                if val is None:
                    logger.warning(f"invalid value params device {val}. obj, {params}")
                    continue
                await set_status_by_name_field_correct(path_segments[1], key, val)

    if path_segments[0] == 'room':
        if len(path_segments) == 4:
            val = params.get('value')
            if val is None:
                logger.warning(f"invalid value params room device {val}. obj, {params}")
                raise ValueError(f"invalid value params room device {val}. obj, {params}")
            await set_value_room(path_segments[1], path_segments[2], path_segments[3], val)
        elif len(path_segments) == 3:
            for key, val in params.items():
                if val is None:
                    logger.warning(f"invalid value params device {val}. obj, {params}")
                    continue
                await set_value_room(path_segments[1], path_segments[2], key, val)





register_command(
    DeviceCommand(
        name="set_value",
        title="Установить значение",
        description="Устанавливает значение поля устройства.",
        parameters=[],
    ),
    set_value_handler,
)

async def device_action_handler(
    path: str,
    command: str,
    params: dict[str, Any],
) -> None:
    logger.debug(
        "Run action handler %s, %s (%s)",
        path,
        command,
        params,
    )

    print(HANDLERS)

    handler = HANDLERS.get(command)
    if handler is None:
        raise ValueError(
            f"Неизвестная команда устройства: {command}"
        )

    await handler(path, params)