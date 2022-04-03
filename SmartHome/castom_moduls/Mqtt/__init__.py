from moduls_src.baseClassModule import BaseControllModule
from moduls_src.services import get
from SmartHome.logic.server.modulesconfig import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema

print("init", __name__)

class Module(BaseControllModule):
    def start(self):
        print(get("Mqtt_MqttValue"))
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

    def end(self):
        self.manager.desconnect()
