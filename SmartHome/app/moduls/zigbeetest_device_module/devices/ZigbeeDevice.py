import logging, json
from app.ingternal.device.classes.baseDevice import BaseDevice
from app.ingternal.device.schemas.config import ConfigSchema, TypesDeviceEnum, ChangeField
from app.ingternal.modules.arrays.serviceDataPoll import ObservableDict, servicesDataPoll
from typing import Optional
from ..settings import MQTT_SERVICE_PATH
from app.configuration.settings import SERVICE_POLL

# Настройка логирования
logger = logging.getLogger(__name__)

class ZigbeeDevice(BaseDevice):

    device_config = ConfigSchema(
        class_img="zigbeetest_device_module/logo_device.png",
        fields_creation=False,
		init_field=True,
		virtual=False,
        address=False,
		token=False,
		type_get_data=False,
		type=True,
		fields_change=ChangeField(
			creation=False,
			deleted=False,
			address=False,
			control=False,
			read_only=False,
			virtual_field=False,
			high=False,
			low=False,
			type=False,
			unit=False,
			name=False,
			enum_values=False,
		),
        )

    def set_value(self, field_id: str, value: str, script:bool = False):
        """
        Устанавливает значение для указанного поля и отправляет команду через MQTT.
        
        :param field_id: ID поля
        :param value: Значение для установки
        """
        super().set_value(field_id, value)
        services:ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        mqtt_service = services.get(MQTT_SERVICE_PATH)
        if mqtt_service is None:
            logger.error("MQTT service is unavailable. Cannot send command.")
            return

        # Получаем поле
        field = self.get_field(field_id)
        if field is None:
            logger.error(f"Field with ID {field_id} not found")
            return
    
        if field.is_virtual_field():
            logger.debug("this field virtual")
            return
        
        address = self.data.address
        field_address = field.get_address()

        message = {f"{field_address}": value}
        json_message = json.dumps(message)
            
        logger.info(f"Sending JSON command to {address}: {json_message}")
        mqtt_service.run_command(f"{address}/set", json_message)
