from app.ingternal.device_types.models.device_type import TypeDevice, FieldTypeDevice
from app.ingternal.device_types.schemas.add_device_type import AddOrEditDeviceTypeSchema
from app.ingternal.device_types.serialize_model.utils import get_id
from app.ingternal.device_types.serialize_model.read import get_type_main_device
from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound
from app.ingternal.device.cache.invalidate_cache import invalidate_cache, invalidate_cache_device_data_by_device
from app.ingternal.room.cache.all_rooms import invalidate_cache_room__type_device_data
from app.ingternal.device.arrays.DevicesArray import DevicesArray
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
        is_main_type = True
        try:
            main_type = await get_type_main_device(type_obj.device)
            if main_type is not None:
                is_main_type = False
        except DeviceTypeNotFound as e:
            is_main_type = True
        new_type_device = await TypeDevice.objects.create(
            name_type=type_obj.name_type,
            id=type_id,
            device=type_obj.device,
            main=is_main_type
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
        invalidate_cache()
        invalidate_cache_device_data_by_device(system_name=type_obj.device)
        invalidate_cache_room__type_device_data()
        DevicesArray.delete(type_obj.device)
        return new_type_device
        
    except Exception as e:
        logger.error(f"Failed to create device type {type_obj.name_type}: {str(e)}", 
                   exc_info=True)
        raise