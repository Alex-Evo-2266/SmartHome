
from typing import Any
from app.pkg.logger import get_automatization
from app.schemas.automation.automation_v4 import DeviceCommand, CommandHandler, CommandParameter
from app.core.services.device.set_status import set_status_by_name_field_correct

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
    device: str,
    params: dict[str, Any],
) -> None:
    for key, val in params.items():
        await set_status_by_name_field_correct(device, key, val)


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
    device: str,
    command: str,
    params: dict[str, Any],
) -> None:
    logger.debug(
        "Run action handler %s, %s (%s)",
        device,
        command,
        params,
    )

    print(HANDLERS)

    handler = HANDLERS.get(command)
    if handler is None:
        raise ValueError(
            f"Неизвестная команда устройства: {command}"
        )

    await handler(device, params)