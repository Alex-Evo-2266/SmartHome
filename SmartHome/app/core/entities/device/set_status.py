
from app.core.ports.interface.device_class import IDevice
from app.exceptions.device import DeviceFieldNotFound
from app.schemas.device.enums import TypeDeviceField
from app.pkg.logger import MyLogger
from app.core.entities.device.field.value_normalizer import normalize_binary_value, normalize_numeric_value

logger = MyLogger().get_logger(__name__)

async def set_status_for_device(device: IDevice, field_id: str, value: str) -> None:
    """Устанавливает статус устройства с учетом типа поля и ограничений."""
    field = device.get_field(field_id)
    if field is None:
        raise DeviceFieldNotFound(f"Field '{field_id}' not found in device '{device.data.system_name}'.")

    if field.get_type() == TypeDeviceField.BINARY:
        final_value = normalize_binary_value(field, value)
    elif field.get_type() == TypeDeviceField.NUMBER:
        final_value = normalize_numeric_value(field, value)
    else:
        final_value = value

    await device.set_value(field_id, final_value)
    logger.info(f"Status for device '{device.data.system_name}', field '{field_id}' set to '{final_value}'")