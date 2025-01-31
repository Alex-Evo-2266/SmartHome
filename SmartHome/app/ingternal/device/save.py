import logging
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.serialize_model.value_set import save_value
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.settings import DEVICE_DATA_POLL

logger = logging.getLogger(__name__)

async def save_device():
    """
    Функция сохранения данных устройств.
    """
    # Получение списка зарегистрированных устройств
    device_list: DeviceRegistry | None = servicesDataPoll.get(DEVICE_DATA_POLL)
    if not device_list:
        logger.warning("Invalid key: DEVICE_DATA_POLL not found in servicesDataPoll.")
        return

    schemas = device_list.get_all_data()
    logger.info(f"Found {len(schemas)} devices to save.")

    # Обработка каждого устройства
    for schema in schemas:
        try:
            await save_value(schema)
            logger.info(f"Successfully saved data for device: {schema.system_name}")
        except Exception as e:
            logger.error(f"Failed to save device {schema.system_name}: {e}")