from moduls_src.baseClassModule import BaseControllModule
from moduls_src.services import get
from settings import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema


class Module(BaseControllModule):

    dependencies = [
    "paho-mqtt"
    ]

    def start(self):
        self.manager = get("Mqtt_MqttConnect")
        configManager.addConfig("mqttBroker",{
            "host":'localhost',
            "port": '1883',
            "user":'admin',
            "password":'admin'
        }, self.manager.reconnect_async)
        self.manager.connect()

    def end(self):
        self.manager.desconnect()
