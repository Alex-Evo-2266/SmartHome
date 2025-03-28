from app.ingternal.device_types.models.device_type import TypeDevice
from app.ingternal.logs.handlers import handler_types
from app.ingternal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

async def delete_type_device_by_device(device_system_name: str):
    """Удаление всех типов устройств, связанных с указанным устройством"""
    try:
        logger.info(f"Starting deletion of device types for device: {device_system_name}")
        
        # Получаем количество типов устройств для удаления (для логов)
        count = await TypeDevice.objects.filter(device=device_system_name).count()
        logger.debug(f"Found {count} device type(s) to delete for device {device_system_name}")
        
        if count == 0:
            logger.warning(f"No device types found for device {device_system_name}. Nothing to delete.")
            return
            
        # Выполняем удаление
        await TypeDevice.objects.filter(device=device_system_name).delete()
        
        logger.info(f"Successfully deleted {count} device type(s) for device {device_system_name}")
        
    except Exception as e:
        logger.error(
            f"Failed to delete device types for device {device_system_name}: {str(e)}",
            exc_info=True
        )
        raise