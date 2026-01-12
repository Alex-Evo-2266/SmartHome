from app.db.models.device.device_type import TypeDevice, FieldTypeDevice
from app.schemas.device.device_type import DeviceTypeSerializeSchema, FieldDeviceTypeSerializeSchema
from app.exceptions.device_type import DeviceTypeNotFound
from app.db.mappers.device.serialize_types import serialive_type_model
from typing import List
from app.pkg.logger import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

def filter_fun(data) -> bool:
    """Фильтрация невалидных данных"""
    result = bool(data)
    if not result:
        logger.debug("Filtered out invalid device type data during serialization")
    return result

async def get_all_type_device() -> List[DeviceTypeSerializeSchema]:
    """
    Получение всех типов устройств с их полями
    Returns:
        List[DeviceTypeSerializeSchema]: Список сериализованных типов устройств
    """
    try:
        logger.info("Starting to fetch all device types")
        
        device_types: List[TypeDevice] = await TypeDevice.objects.all()
        logger.debug(f"Found {len(device_types)} raw device types in database")
        
        serialized_device_types = list(filter(
            filter_fun,
            [await serialive_type_model(device, fields_include=True) for device in device_types]
        ))
        
        logger.info(f"Successfully retrieved {len(serialized_device_types)} valid device types")
        return serialized_device_types
        
    except Exception as e:
        logger.error(f"Failed to fetch device types: {str(e)}", exc_info=True)
        raise

async def get_type_device(system_name: str) -> List[DeviceTypeSerializeSchema]:
    """
    Получение типа устройства по системному имени устройства
    Args:
        system_name (str): Системное имя устройства
    Returns:
        DeviceTypeSerializeSchema: Сериализованный тип устройства
    Raises:
        DeviceTypeNotFound: Если тип устройства не найден
    """
    try:
        logger.info(f"Fetching device type for device: {system_name}")
        
        device_types: List[TypeDevice] = await TypeDevice.objects.filter(device=system_name).all()
        
        if len(device_types) == 0:
            logger.warning(f"Device type not found for device: {system_name}")
            raise DeviceTypeNotFound("Device type not found")
        
        logger.debug(f"Found device type for {system_name}, proceeding with serialization")
        serialized_device_type = [await serialive_type_model(device_type, fields_include=True) for device_type in device_types]
        
        logger.info(f"Successfully retrieved device type for {system_name}")
        return serialized_device_type
        
    except DeviceTypeNotFound:
        raise  # Перевыбрасываем уже залогированное исключение
    except Exception as e:
        logger.error(f"Error fetching device type for {system_name}: {str(e)}", exc_info=True)
        raise

async def get_type_main_device(system_name: str) -> DeviceTypeSerializeSchema:
    """
    Получение типа устройства по системному имени устройства
    Args:
        system_name (str): Системное имя устройства
    Returns:
        DeviceTypeSerializeSchema: Сериализованный тип устройства
    Raises:
        DeviceTypeNotFound: Если тип устройства не найден
    """
    try:
        logger.info(f"Fetching device type for device: {system_name}")
        
        device_types: List[TypeDevice] = await TypeDevice.objects.filter(device=system_name, main=True).all()
        
        if len(device_types) == 0:
            logger.warning(f"Device type not found for device: {system_name}")
            raise DeviceTypeNotFound("Device type not found")
        
        logger.debug(f"Found device type for {system_name}, proceeding with serialization")
        serialized_device_type = await serialive_type_model(device_types[0], fields_include=True)
        
        logger.info(f"Successfully retrieved device type for {system_name}")
        return serialized_device_type
        
    except DeviceTypeNotFound:
        raise  # Перевыбрасываем уже залогированное исключение
    except Exception as e:
        logger.error(f"Error fetching device type for {system_name}: {str(e)}", exc_info=True)
        raise