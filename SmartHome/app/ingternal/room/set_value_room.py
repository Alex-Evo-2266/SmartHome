from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.device import DeviceSerializeSchema
from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound
from app.ingternal.device_types.serialize_model.read import get_type_device
from app.ingternal.device.set_device_status import set_status_for_device
import logging

logger = logging.getLogger(__name__)

def get_devices_room(room: str) -> list[IDevice]:
    """Возвращает все устройства в указанной комнате."""
    return [
        item.device
        for item in DevicesArray.all()
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
