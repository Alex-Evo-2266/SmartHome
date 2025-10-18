import json, logging
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.enums import ReceivedDataFormat
from .settings import ZIGBEE_DEVICE_CLASS
# from .logs import getLogger

# Настройка логирования
# logger = getLogger(__name__)

logger = logging.getLogger(__name__)

async def device_set_value(topik, value):


    logger.info("Processing MQTT message...")

    try:
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

            if class_device != ZIGBEE_DEVICE_CLASS:
                continue

            fields = device.get_fields()
            if not fields:
                logger.warning(f"Device {address_device} has no fields, skipping...")
                continue

            data = value

            if type_message == ReceivedDataFormat.JSON:
                logger.info(f"Processing JSON message for device {address_device}")

                # Получаем данные из токена
                if data is None or address_device != topik:
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
                        new_data = json_data.get(field_address, None)
                        if new_data is None:
                            continue
                        logger.info(f"Setting field {field_address} for device {address_device} to {new_data}")
                        field.set(str(new_data))
            elif type_message == ReceivedDataFormat.STRING:
                logger.info(f"Processing STRING message for device {address_device}")

                for field in fields:
                    field_address = field.get_address()
                    full_address = f"{address_device}/{field_address}"

                    if data is None or full_address != topik:
                        logger.warning(f"No data found for field {field_address} in device {address_device}, skipping...")
                        continue

                    logger.info(f"Setting field {field_address} for device {address_device} to {data}")
                    field.set(data)
    except Exception as e:
        logger.error(e)

    logger.info("MQTT message processing complete.")