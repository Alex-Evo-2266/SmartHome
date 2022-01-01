import logging, json

from SmartHome.websocket.manager import manager
from SmartHome.logic.server.modulesconfig import configManager

from .schemas import ZigbeeDeviceSchema
from .utils import editAdressLincDevices, decodRemove, formatDev
from castom_moduls.Mqtt.mqttConnect import getManager as getManagerMqtt

logger = logging.getLogger(__name__)


def objectlist_to_dictlist(data: list):
    arr = list()
    for item in data:
        arr.append(item.dict())
    return arr

class ZigbeeCoordinator:
    def __init__(self):
        self.permit_join = True
        zigbee = configManager.getConfig('zigbee')
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
        getManagerMqtt().publish(self.topic + "/bridge/request/options",'{"options": {"mqtt": {"base_topic":"'+ zigbee['topic'] +'"}}}')
        self.topic = zigbee['topic']

    def reboot(self):
        topic = self.topic + "/bridge/request/restart"
        getManagerMqtt().publish(topic,"")

    def permission_join(self,state:bool):
        topic = self.topic + "/bridge/request/permit_join"
        getManagerMqtt().publish(topic,state)

    def zigbeeDeviceRename(self, name:str, newName:str):
        topic = self.topic + "/bridge/request/device/rename"
        message = '{"from": "' + name + '", "to": "' + newName + '"}'
        getManagerMqtt().publish(topic,message)

    def zigbeeDeviceDelete(self, name):
        topic = self.topic + "/bridge/request/device/remove"
        message = '{"id": "' + name + '"}'
        getManagerMqtt().publish(topic,message)

from moduls_src.managers import add, get

def initManager():
    add("zigbee", ZigbeeCoordinator())
    return get("zigbee")

def getManager():
    return get("zigbee")
