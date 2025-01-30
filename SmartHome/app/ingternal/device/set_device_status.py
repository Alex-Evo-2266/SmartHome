import logging
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.interface.device_class import IDevice

logger = logging.getLogger(__name__)

async def set_status(system_name: str, field_id: str, value: str) -> None:
    logger.info(f"Attempting to set status for device '{system_name}', field '{field_id}' with value '{value}'")
    
    # Получаем устройство по имени системы
    device_cond = DevicesArray.get(system_name)
    if not device_cond:
        logger.error(f"Device '{system_name}' not found.")
        raise DeviceNotFound(f"Device '{system_name}' not found.")
    
    # Получаем объект устройства и устанавливаем значение
    device: IDevice = device_cond.device
    try:
        device.set_value(field_id, value)
        logger.info(f"Successfully set status for device '{system_name}', field '{field_id}' to '{value}'")
    except Exception as e:
        logger.error(f"Error setting value for device '{system_name}', field '{field_id}': {str(e)}")
        raise