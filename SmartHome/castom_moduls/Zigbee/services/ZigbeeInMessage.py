import logging, json
from castom_moduls.Zigbee.settings import CONFIG_NAME
from moduls_src.services import BaseService

from SmartHome.websocket.manager import manager
from settings import configManager

from castom_moduls.Zigbee.src.utils import editAdressLincDevices, decodRemove, formatDev

logger = logging.getLogger(__name__)


def objectlist_to_dictlist(data: list):
    arr = list()
    for item in data:
        arr.append(item["data"].dict())
    return arr

async def decodeZigbeeDevices(self, topic, message):
    try:
        data = json.loads(message)
        config = configManager.getConfig(CONFIG_NAME)
        self.devices = []
        for item in data:
            dev = formatDev(item)
            self.addzigbeeDevices(dev.address,dev)
        await manager.send_information("zigbee",objectlist_to_dictlist(self.devices))
    except Exception as e:
        logger.error(f'zigbee devices decod {e}')

async def decodeZigbeeConfig(self, topic, message):
    data = json.loads(message)
    self.permit_join = data["permit_join"]

async def decodEvent(self, topic, message):
    data = json.loads(message)
    newdata = data["data"]
    newdata = formatDev(newdata)
    if(data["type"]=="device_interview"):
        await manager.send_information("connect_device",newdata.dict())
    if(data["type"]=="device_joined"):
        await manager.send_information("start_connect",newdata.dict())
    if(data["type"]=="device_leave"):
        await manager.send_information("leave",newdata.dict())
    if(data["type"]=="device_announce"):
        await manager.send_information("announced",newdata.dict())
        # for item in zigbeeDevices:
        #     if(item["id"]==newdata["address"]):
        #         await manager.send_information("newZigbeesDevice",item["data"])


class ZigbeeInMessage(BaseService):
    def __init__(self):
        self.permit_join = True
        self.callbacks = {}
        self.devices = []
        zigbee = configManager.getConfig('zigbee')
        if not zigbee:
            self.topic = "zigbee2mqtt"
            logger.error("no zigbee config")
        else:
            self.topic = zigbee['topic']
        self.addcallback(
            '/'.join([self.topic,"bridge","response","device","rename"]),
            editAdressLincDevices
            )
        self.addcallback(
            '/'.join([self.topic,"bridge","response","device","remove"]),
            decodRemove
            )
        self.addcallback(
            '/'.join([self.topic,"bridge","event"]),
            decodEvent
            )
        self.addcallback(
            '/'.join([self.topic,"bridge","devices"]),
            decodeZigbeeDevices
            )
        self.addcallback(
            '/'.join([self.topic,"bridge","info"]),
            decodeZigbeeConfig
            )

    def addcallback(self, topic, callback):
        self.callbacks[topic] = callback

    async def decodTopic(self, topic, message):
        if topic in self.callbacks:
            f = self.callbacks[topic]
            await f(self, topic, message)

    def getDevices(self):
        arr = list()
        for item in self.devices:
            arr.append(item["data"])
        return arr

    def addzigbeeDevices(self, id, data):
        dev = dict()
        a=True
        for item in self.devices:
            if(item["id"]==id):
                item["data"]=data
                a=False
        if(a):
            dev["id"] = id
            dev["data"] = data
            self.devices.append(dev)
