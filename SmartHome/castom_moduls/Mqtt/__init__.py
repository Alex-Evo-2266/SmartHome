from moduls_src.baseClassModule import BaseControllModule
from moduls_src.services import get
from SmartHome.logic.server.modulesconfig import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from .settings import DEVICE_NAME


class Module(BaseControllModule):

    dependencies = [
    "paho-mqtt"
    ]

    def start(self):
        self.manager = get("Mqtt_MqttConnect")
        configManager.addConfig(
            ServerModuleConfigSchema(
                name="mqttBroker",
                fields=[
                    ServerModuleConfigFieldSchema(
                        name="host",
                        value='localhost'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="port",
                        value='1883'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="user",
                        value='admin'
                    ),
                    ServerModuleConfigFieldSchema(
                        name="password",
                        value='admin'
                    )
                ]
            ),
            self.manager.reconnect_async
        )
        self.manager.connect()
        print("df")

    def end(self):
        self.manager.desconnect()
