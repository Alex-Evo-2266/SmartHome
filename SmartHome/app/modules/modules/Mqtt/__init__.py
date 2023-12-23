from app.modules.modules.Mqtt.devices.MQTTDevice import MqttDevice
from .services.MqttConnect import MqttConnect
from .services.MqttDeviceControl import MqttDeviceControl
from app.modules.modules_src.modules import BaseModule
from .routs.router import router as mqtt_router
from app.configuration.config import __module_config__
from .settings import CONFIG_NAME, SERVICE_MQTT
from app.modules.modules_src.services import Services
# from castom_moduls.Mqtt.settings import CONFIG_NAME
# from app.settings import configManager

class MqttModule(BaseModule):

    dependencies = [
        "paho-mqtt"
    ]

    routers = [mqtt_router]

    manager:MqttConnect = Services.get(SERVICE_MQTT)

    @classmethod
    def start(cls):
        __module_config__.register_config(CONFIG_NAME,{
            "host":'localhost',
            "port": '1883',
            "user":'admin',
            "password":'admin'
        }, cls.manager.reconnect_async)
        cls.manager.connect()

    @classmethod
    def end(cls):
        cls.manager.desconnect()
