from typing import Optional, List
import logging
from datetime import datetime

from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.models.device import Device, DeviceField, Value
from app.ingternal.device.serialize_model.utils import create_value_id
from app.ingternal.device.exceptions.device import DeviceNotFound

# Настройка логирования
logger = logging.getLogger(__name__)

async def save_value(data: DeviceSchema):
    """
    Сохраняет значения для устройства на основе входных данных.

    :param data: Объект DeviceSchema с данными устройства
    :raises DeviceNotFound: если устройство не найдено
    """
    # Получаем устройство по system_name
    device: Optional[Device] = await Device.objects.get_or_none(system_name=data.system_name)
    if not device:
        logger.error(f"Device with system_name '{data.system_name}' not found.")
        raise DeviceNotFound()

    # Получаем все поля устройства
    fields: List[DeviceField] = await DeviceField.objects.filter(device=device).all()
    if not fields:
        logger.warning(f"Device '{data.system_name}' has no fields.")
        return

    values_to_create = []  # Буфер для batch-создания записей

    for field in fields:
        value = data.value.get(field.name)  # Безопасное извлечение значения
        if value is None:
            logger.warning(f"Field '{field.name}' not found in incoming data, skipping.")
            continue

        try:
            id = await create_value_id()
            current_date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            values_to_create.append(Value(field=field, id=id, value=value, datatime=current_date_str))
        except Exception as e:
            logger.error(f"Failed to create value ID for field '{field.name}': {e}")

    # Создаём записи одним запросом, если есть данные
    if values_to_create:
        try:
            await Value.objects.bulk_create(values_to_create)
            logger.info(f"Successfully saved {len(values_to_create)} values for device '{data.system_name}'.")
        except Exception as e:
            logger.error(f"Bulk insert failed, saving individually: {e}")
            for val in values_to_create:
                await val.save()
    else:
        logger.info(f"No valid values to save for device '{data.system_name}'.")