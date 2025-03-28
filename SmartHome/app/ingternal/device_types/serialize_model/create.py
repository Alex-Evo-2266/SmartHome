from app.ingternal.device_types.models.device_type import TypeDevice, FieldTypeDevice
from app.ingternal.device_types.schemas.add_device_type import AddOrEditDeviceTypeSchema
from app.ingternal.device_types.serialize_model.utils import get_id
from app.ingternal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

async def create(type_obj: AddOrEditDeviceTypeSchema):
    """Создание нового типа устройства с полями"""
    try:
        logger.info(f"Starting creation of new device type: {type_obj.name_type}")
        
        # Логирование входных данных (без чувствительной информации)
        logger.debug(f"Creating device type with params: name={type_obj.name_type}, "
                   f"device={type_obj.device}, fields_count={len(type_obj.fields)}")
        
        # Создание основного типа устройства
        type_id = get_id()
        logger.debug(f"Generated ID for new device type: {type_id}")
        new_type_device = await TypeDevice.objects.create(
            name_type=type_obj.name_type,
            id=type_id,
            device=type_obj.device
        )
        logger.info(f"Successfully created base device type: {type_obj.name_type} (ID: {type_id})")
        
        # Создание полей для типа устройства
        fields_created = 0
        for field in type_obj.fields:
            field_id = get_id()
            try:
                logger.debug(f"Creating field: {field.name_field_type} (ID: {field_id}) for device type {type_id}")
                await FieldTypeDevice.objects.create(
                    **(field.dict()),
                    device_type=new_type_device,
                    id=field_id
                )
                fields_created += 1
                logger.debug(f"Successfully created field {field.name_field_type} (ID: {field_id})")
            except Exception as field_error:
                logger.error(f"Failed to create field {field.name_field_type}: {str(field_error)}", 
                             exc_info=True)
                # Продолжаем создание остальных полей даже если одно не удалось
                continue
        
        logger.info(f"Completed device type creation. Successfully created {fields_created} "
                  f"out of {len(type_obj.fields)} fields for device type {type_obj.name_type}")
        
        return new_type_device
        
    except Exception as e:
        logger.error(f"Failed to create device type {type_obj.name_type}: {str(e)}", 
                   exc_info=True)
        raise