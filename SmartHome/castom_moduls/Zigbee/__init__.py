from moduls_src.baseClassModule import BaseControllModule
from moduls_src.services import get
from settings import configManager
from SmartHome.schemas.server import ServerConfigSchema, ServerModuleConfigFieldSchema, ServerModuleConfigSchema
from .settings import DEVICE_NAME

class Module(BaseControllModule):

    def start(self):
        configManager.addConfig("zigbee",{
            "topic":'zigbee2mqtt'
        })
        get("Mqtt_MqttValue").addConnect(DEVICE_NAME)
        get("Mqtt_MqttConnect").addcallback("zigbee",get("Zigbee_ZigbeeInMessage").decodTopic)
