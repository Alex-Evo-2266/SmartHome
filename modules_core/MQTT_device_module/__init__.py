from app.ingternal.modules.classes.baseModules import BaseModule
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.configuration.settings import SERVICE_POLL, SERVICE_DATA_POLL
from .services.MqttService import MqttService
from .settings import MQTT_SERVICE_PATH, MQTT_PASSWORD, MQTT_BROKER_IP, MQTT_PORT, MQTT_USERNAME, MQTT_MESSAGES
from app.pkg import itemConfig, ConfigItemType, __config__
from .device_field_set import device_set_value

from typing import Optional

class Module(BaseModule):
    
    @classmethod
    async def start(cls):
        await super().start()

        services: ObservableDict = servicesDataPoll.get(SERVICE_POLL)
        service_dara: ObservableDict = servicesDataPoll.get(SERVICE_DATA_POLL)
        mqtt_service: Optional[MqttService] = services.get(MQTT_SERVICE_PATH)
        service_dara.set(MQTT_MESSAGES, {})

        print(mqtt_service)

        __config__.register_config(
            itemConfig(tag="mqtt", key=MQTT_USERNAME, type=ConfigItemType.TEXT, value="root"),
            mqtt_service.restart
        )

        __config__.register_config(
            itemConfig(tag="mqtt", key=MQTT_PASSWORD, type=ConfigItemType.PASSWORD, value="root"),
            mqtt_service.restart
        )

        __config__.register_config(
            itemConfig(tag="mqtt", key=MQTT_BROKER_IP, type=ConfigItemType.TEXT, value="mosquitto"),
            mqtt_service.restart
        )

        __config__.register_config(
            itemConfig(tag="mqtt", key=MQTT_PORT, type=ConfigItemType.NUMBER, value="1883"),
            mqtt_service.restart
        )

        if mqtt_service:
            mqtt_service.subscribe("", device_set_value)
        

        await mqtt_service.start()


