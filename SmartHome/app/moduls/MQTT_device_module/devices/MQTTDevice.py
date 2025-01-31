import json
import logging
from typing import Optional
from app.ingternal.device.classes.baseDevice import BaseDevice
from ..services.MqttService import MqttService
from ..settings import MQTT_SERVICE_PATH
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.schemas.enums import ReceivedDataFormat

# Настройка логирования
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class MQTTDevice(BaseDevice):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        logger.info("MQTTDevice initialized")

    def load(self):
        """ Загружает устройство (синхронно). """
        super().load()
        logger.info("MQTTDevice loaded")

    async def load_async(self):
        """ Загружает устройство (асинхронно). """
        await super().load_async()
        logger.info("MQTTDevice loaded asynchronously")

    def set_value(self, field_id: str, value: str):
        """
        Устанавливает значение для указанного поля и отправляет команду через MQTT.
        
        :param field_id: ID поля
        :param value: Значение для установки
        """
        super().set_value(field_id, value)

        # Получаем MQTT сервис
        mqtt_service: Optional[MqttService] = servicesDataPoll.get(MQTT_SERVICE_PATH)
        if mqtt_service is None:
            logger.error("MQTT service is unavailable. Cannot send command.")
            return

        # Получаем поле
        field = self.get_field(field_id)
        if field is None:
            logger.error(f"Field with ID {field_id} not found")
            return
        
        address = self.data.address
        field_address = field.get_address()

        if self.data.type_command == ReceivedDataFormat.JSON:
            # Формируем JSON-сообщение
            message = {f"{field_address}/set": value}
            json_message = json.dumps(message)
            
            logger.info(f"Sending JSON command to {address}: {json_message}")
            mqtt_service.run_command(address, json_message)

        elif self.data.type_command == ReceivedDataFormat.STRING:
            # Формируем строковую команду
            full_address = f"{address}/{field_address}"
            
            logger.info(f"Sending STRING command to {full_address}: {value}")
            mqtt_service.run_command(full_address, value)

        else:
            logger.warning(f"Unknown command type: {self.data.type_command}")