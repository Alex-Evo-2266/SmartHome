from app.ingternal.device_types.models.device_type import TypeDevice, FieldTypeDevice
from app.ingternal.device_types.schemas.device_type import DeviceTypeSerializeSchema, FieldDeviceTypeSerializeSchema
from app.ingternal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

async def serialive_type_model(device_type: TypeDevice, fields_include: bool = True) -> DeviceTypeSerializeSchema:
    """
    Сериализация модели типа устройства в схему
    
    Args:
        device_type: Модель типа устройства для сериализации
        fields_include: Включать ли поля устройства в результат
        
    Returns:
        DeviceTypeSerializeSchema: Сериализованная схема типа устройства
        
    Raises:
        Exception: При ошибках сериализации
    """
    try:
        logger.debug(f"Starting serialization for device type ID: {device_type.id}")
        
        # Базовые данные устройства
        data = DeviceTypeSerializeSchema(
            id=device_type.id,
            name_type=device_type.name_type,
            device=device_type.device
        )
        
        if fields_include:
            logger.debug(f"Including fields for device type ID: {device_type.id}")
            try:
                fields = await device_type.fields.all()
                logger.debug(f"Found {len(fields)} fields for device type ID: {device_type.id}")
                
                data.fields = [await serialize_field_type_model(x) for x in fields]
                logger.debug(f"Successfully serialized {len(data.fields)} fields")
            except Exception as e:
                logger.error(f"Failed to serialize fields for device type ID: {device_type.id}: {str(e)}",
                            exc_info=True)
                data.fields = []
                
        logger.info(f"Successfully serialized device type ID: {device_type.id}")
        return data
        
    except Exception as e:
        logger.error(f"Failed to serialize device type ID: {device_type.id}: {str(e)}",
                   exc_info=True)
        raise

async def serialize_field_type_model(field: FieldTypeDevice, device_include: bool = False) -> FieldDeviceTypeSerializeSchema:
    """
    Сериализация модели поля типа устройства
    
    Args:
        field: Модель поля для сериализации
        device_include: Включать ли информацию о типе устройства
        
    Returns:
        FieldDeviceTypeSerializeSchema: Сериализованная схема поля
        
    Raises:
        Exception: При ошибках сериализации
    """
    try:
        logger.debug(f"Serializing field ID: {field.id}")
        
        field_data = FieldDeviceTypeSerializeSchema(
            id=field.id,
            name_field_type=field.name_field_type,
            id_field_device=field.id_field_device,
            description=field.description,
            field_type=field.field_type,
            required=field.required
        )
        
        if device_include:
            logger.debug(f"Including device type info for field ID: {field.id}")
            try:
                await field.device_type.load()
                field_data.device_type = field.device_type
                logger.debug(f"Successfully loaded device type for field ID: {field.id}")
            except Exception as e:
                logger.error(f"Failed to load device type for field ID: {field.id}: {str(e)}",
                          exc_info=True)
                field_data.device_type = None
                
        logger.debug(f"Successfully serialized field ID: {field.id}")
        return field_data
        
    except Exception as e:
        logger.error(f"Failed to serialize field ID: {field.id}: {str(e)}",
                   exc_info=True)
        raise