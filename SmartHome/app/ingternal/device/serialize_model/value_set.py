from typing import List
import logging
from datetime import datetime, timezone

from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.models.device import Value
from app.ingternal.device.serialize_model.utils import create_value_id
from app.ingternal.device.serialize_model.cach_field import get_cached_last_value, invalidate_cache_for_field, get_cached_fields, CachFieldData

# Настройка логирования
logger = logging.getLogger(__name__)

async def save_values(data: List[DeviceSchema]):
    values_to_create:List[Value] = []  # Буфер для batch-создания записей

    for device in data:
        fields: List[CachFieldData] = await get_cached_fields(device.system_name)
        if not fields:
            logger.warning(f"Device '{device.system_name}' has no fields.")
            continue
        for field in fields:
            value = device.value.get(field.name)  # Безопасное извлечение значения
            (old_value, status_old) = await get_cached_last_value(field.id)
            if value is None and status_old and device.status != status_old:
                try:
                    id = await create_value_id()
                    current_date_str = datetime.now().isoformat()
                    values_to_create.append(Value(field=field.id, id=id, value=old_value, datatime=current_date_str, status_device=device.status))
                    invalidate_cache_for_field(field.id)
                    continue
                except Exception as e:
                    logger.error(f"Failed to create value ID for field '{field.name}': {e}")
                    continue
            if value is None:
                logger.warning(f"Field '{field.name}' not found in incoming data, skipping.")
                continue
            if not old_value or old_value != value or device.status != status_old:
                try:
                    id = await create_value_id()
                    current_date_str = datetime.now().isoformat()
                    values_to_create.append(Value(field=field.id, id=id, value=value, datatime=current_date_str, status_device=device.status))
                    invalidate_cache_for_field(field.id)
                except Exception as e:
                    logger.error(f"Failed to create value ID for field '{field.name}': {e}")
    # Создаём записи одним запросом, если есть данные
    if values_to_create:
        try:
            await Value.objects.bulk_create(values_to_create)
            logger.info(f"Successfully saved {len(values_to_create)} values for devices.")
        except Exception as e:
            logger.error(f"Bulk insert failed, saving individually: {e}")
            for val in values_to_create:
                await val.save()
    else:
        logger.info(f"No valid values to save for devices.")
