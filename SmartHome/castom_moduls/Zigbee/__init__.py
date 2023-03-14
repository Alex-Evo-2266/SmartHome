from castom_moduls.Zigbee.services.ZigbeeCoordinator import ZigbeeCoordinator
# from castom_moduls.Zigbee.services.ZigbeeInMessage import ZigbeeInMessage
from castom_moduls.Zigbee.settings import CONFIG_NAME
from moduls_src.moduls import BaseModule
from moduls_src.services import Services
from settings import configManager

class ZigbeeModule(BaseModule):

    @staticmethod
    def start():
        configManager.addConfig(CONFIG_NAME,{
            "topic":'zigbee2mqtt'
        })
        Services.get("Mqtt_MqttValue").addConnect("ZigbeeDevice")
        # Services.get("Mqtt_connect").addcallback("zigbee",Services.get("ZigbeeInMessage").decodTopic)
