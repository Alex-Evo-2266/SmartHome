from app.ingternal.device_types.models.device_type import TypeDevice
from app.ingternal.logs import get_base_logger
from app.ingternal.device.get_cached_device_data import invalidate_cache_device_data
from app.ingternal.device.serialize_model.cach_field import invalidate_cache_field
from app.ingternal.device.arrays.DevicesArray import DevicesArray

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
        invalidate_cache_device_data()
        invalidate_cache_field(system_name=device_system_name)
        DevicesArray.delete(device_system_name)
    except Exception as e:
        logger.error(
            f"Failed to delete device types for device {device_system_name}: {str(e)}",
            exc_info=True
        )
        raise

async def delete_type_device(id: str):
    """Удаление всех типов устройств, связанных с указанным устройством"""
    try:
        logger.info(f"Starting deletion of device types id: {id}")
        
        # Получаем количество типов устройств для удаления (для логов)
        type_dev: TypeDevice | None = await TypeDevice.objects.filter(id=id).get_or_none()
        logger.debug(f"Found {type_dev} device type to delete id: {id}")
        
        if type_dev is None:
            logger.warning(f"No device types found id: {id}. Nothing to delete.")
            return
        system_name = type_dev.device
        name = type_dev.name_type
        # Выполняем удаление
        await TypeDevice.objects.filter(id=id).delete()
        
        
        logger.info(f"Successfully deleted {name} device type id: {id}")
        invalidate_cache_device_data()
        invalidate_cache_field(system_name=system_name)
        DevicesArray.delete(system_name)
    except Exception as e:
        logger.error(
            f"Failed to delete device types id: {id}: {str(e)}",
            exc_info=True
        )
        raise