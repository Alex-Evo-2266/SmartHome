from moduls_src.baseClassModule import BaseControllModule
from moduls_src.services import get
from SmartHome.logic.server.modulesconfig import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema

print("init", __name__)

class Module(BaseControllModule):
    def start(self):
        configManager.addConfig(
            ServerModuleConfigSchema(
                name="zigbee",
                fields=[
                    ServerModuleConfigFieldSchema(
                        name="topic",
                        value='zigbee2mqtt'
                    ),
                ]
            )
        )
        get("Mqtt_MqttValue").addConnect("Zigbee_ZigbeeDevice")
        get("Mqtt_MqttConnect").addcallback("zigbee",get("Zigbee_ZigbeeInMessage").decodTopic)
