import logging, json
from castom_moduls.Zigbee.settings import CONFIG_NAME
from moduls_src.services import BaseService

from SmartHome.websocket.manager import manager
from settings import configManager


logger = logging.getLogger(__name__)


def objectlist_to_dictlist(data: list):
    arr = list()
    for item in data:
        arr.append(item.dict())
    return arr

class ZigbeeCoordinator(BaseService):
    def __init__(self):
        self.permit_join = True
        zigbee = configManager.getConfig(CONFIG_NAME)
        if not zigbee:
            self.topic = "zigbee2mqtt"
            logger.error("no zigbee config")
        else:
            self.topic = zigbee['topic']

    def updateTopic(self):
        zigbee = configManager.getConfig('zigbee')
        if not zigbee:
            logger.error("no zigbee config")
            return
        get("Mqtt_MqttConnect").publish(self.topic + "/bridge/request/options",'{"options": {"mqtt": {"base_topic":"'+ zigbee['topic'] +'"}}}')
        self.topic = zigbee['topic']

    def reboot(self):
        topic = self.topic + "/bridge/request/restart"
        get("Mqtt_MqttConnect").publish(topic,"")

    def permission_join(self,state:bool):
        topic = self.topic + "/bridge/request/permit_join"
        get("Mqtt_MqttConnect").publish(topic,state)

    def zigbeeDeviceRename(self, name:str, newName:str):
        topic = self.topic + "/bridge/request/device/rename"
        message = '{"from": "' + name + '", "to": "' + newName + '"}'
        get("Mqtt_MqttConnect").publish(topic,message)

    def zigbeeDeviceDelete(self, name):
        topic = self.topic + "/bridge/request/device/remove"
        message = '{"id": "' + name + '"}'
        get("Mqtt_MqttConnect").publish(topic,message)
