from typing import List
import logging
from datetime import datetime, timezone

from app.schemas.device.device import DeviceSchema
from app.db.models.device import Value
from app.db.repositories.device.utils.utils import get_id
from app.db.cache.device.invalidate_cache import invalidate_cache_device_data_by_field
from app.db.cache.device.cach_field import get_cached_last_value, get_cached_fields, CachFieldData
from app.pkg.logger import get_device_save

# Настройка логирования
logger = get_device_save.get_logger(__name__)

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
                    id = get_id()
                    current_date_str = datetime.now(timezone.utc).isoformat()
                    values_to_create.append(Value(field=field.id, id=id, value=old_value, datatime=current_date_str, status_device=device.status))
                    invalidate_cache_device_data_by_field(field.id)
                    continue
                except Exception as e:
                    logger.error(f"Failed to create value ID for field '{field.name}': {e}")
                    continue
            if value is None:
                logger.warning(f"Field '{field.name}' not found in incoming data, skipping.")
                continue
            if not old_value or old_value != value or device.status != status_old:
                try:
                    id = get_id()
                    current_date_str = datetime.now(timezone.utc).isoformat()
                    values_to_create.append(Value(field=field.id, id=id, value=value, datatime=current_date_str, status_device=device.status))
                    invalidate_cache_device_data_by_field(field.id)
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
