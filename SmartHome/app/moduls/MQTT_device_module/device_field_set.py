import json
import logging
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.enums import ReceivedDataFormat
from .settings import MQTT_MESSAGES, MQTT_DEVICE_CLASS
from .utils import get_value_from_token

# Настройка логирования
logger = logging.getLogger(__name__)

async def device_set_value(key, value):
    """
    Обрабатывает входящее MQTT-сообщение и устанавливает значения для устройств.

    :param key: Ключ MQTT-сообщения
    :param value: Значение сообщения
    """
    if key != MQTT_MESSAGES:
        logger.debug(f"Ignoring message with key: {key}")
        return

    logger.info("Processing MQTT message...")

    # Получаем все устройства
    devices = DevicesArray.all()
    if not devices:
        logger.warning("No devices found in DevicesArray")
        return

    for device_cond in devices:
        device: IDevice = device_cond.device
        class_device = device.get_class()
        address_device = device.get_address()
        type_message = device.get_type_command()

        if class_device != MQTT_DEVICE_CLASS:
            continue

        fields = device.get_fields()
        if not fields:
            logger.warning(f"Device {address_device} has no fields, skipping...")
            continue

        if type_message == ReceivedDataFormat.JSON:
            logger.info(f"Processing JSON message for device {address_device}")

            # Получаем данные из токена
            data = get_value_from_token(address_device, value)
            if not data:
                logger.warning(f"No data extracted for device {address_device}, skipping...")
                continue

            try:
                json_data = json.loads(data)
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON data for device {address_device}: {data}")
                continue

            for field in fields:
                field_address = field.get_address()
                if field_address in json_data:
                    new_data = json_data.get(field_address, "")
                    logger.info(f"Setting field {field_address} for device {address_device} to {new_data}")
                    field.set(json.dumps(new_data))

        elif type_message == ReceivedDataFormat.STRING:
            logger.info(f"Processing STRING message for device {address_device}")

            for field in fields:
                field_address = field.get_address()
                full_address = f"{address_device}/{field_address}"

                data = get_value_from_token(full_address, value)
                if not data:
                    logger.warning(f"No data found for field {field_address} in device {address_device}, skipping...")
                    continue

                logger.info(f"Setting field {field_address} for device {address_device} to {data}")
                field.set(data)

    logger.info("MQTT message processing complete.")