from app.core.state.get_store import get_container
from app.core.ports.interface.device_class import IDevice
from app.schemas.device.device import DeviceSerializeSchema
from app.exceptions.device_type import DeviceTypeNotFound
from app.db.repositories.device.read_type import get_type_device
from app.core.entities.device.set_status import set_status_for_device
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

def get_devices_room(room: str) -> list[IDevice]:
    """Возвращает все устройства в указанной комнате."""
    return [
        item.device
        for item in get_container().connect_store.all()
        if item.device.data.room == room
    ]

async def set_value_room(room: str, device_type: str, field: str, value: str):
    """
    Для всех устройств в комнате указанного типа
    устанавливает значение для заданного поля.
    """
    logger.info(f"set value input data: room={room} devcie={device_type} field={field} value={value}")
    devices = get_devices_room(room)
    for device in devices:
        try:
            types= device.data.all_types
            # types = await get_type_device(device.data.system_name)
        except DeviceTypeNotFound:
            logger.debug(
                f"Тип устройства не найден для {device.data.system_name}, пропускаем."
            )
            continue

        for type_info in types:
            if type_info.name_type != device_type:
                continue

            matching_fields = [
                f for f in type_info.fields if f.name_field_type == field
            ]
            for field_info in matching_fields:
                try:
                    await set_status_for_device(device, field_info.id_field_device, value)
                    logger.info(
                        f"Значение {field} устройства {device.data.system_name} обновлено на {value}"
                    )
                except Exception:
                    logger.exception(
                        f"Ошибка при обновлении {field} устройства {device.data.system_name}"
                    )
