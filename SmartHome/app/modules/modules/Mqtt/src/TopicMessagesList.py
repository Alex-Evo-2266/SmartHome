# from SmartHome.logic.server.modulesconfig import configManager
from typing import List
from app.ingternal.device.enums import ReceivedDataFormat
from app.ingternal.websoket.websocket import WebSocketMenager
# from app.ingternal.device.models.device import Device, Device_field
from app.ingternal.device.devices_arrey import DevicesArrey, DevicesArreyItem
from app.ingternal.device.interfaces.device_interface import IDevice
from app.ingternal.device.interfaces.field_interface import IField
from ..settings import WEBSOCKET_TOPIC
import ast
import json
import logging

logger = logging.getLogger(__name__)

def dict_to_list(data):
    arr = list()
    for key in data:
        arr.append(data[key])
    return arr

class TopicMessagesList():
    mqttTopics = {}

    @classmethod
    def clear(cls):
        cls.mqttTopics = {}

    @classmethod
    async def add(cls, topic, message):
        msg = {
            "topic":topic,
            "message":message
        }
        cls.mqttTopics[topic] = msg
        await WebSocketMenager.send_information(WEBSOCKET_TOPIC, dict_to_list(cls.mqttTopics))
        return msg

    @classmethod
    def all(cls):
        return dict_to_list(cls.mqttTopics)

    @classmethod
    def get_topicks_and_linc(cls):
        try:
            topics = dict_to_list(cls.mqttTopics)
            newArr = list()
            for item in topics:
                topic:str = item["topic"]
                last = topic.split('/')[-1]
                first = topic.split('/')[0:-1]
                first = "/".join(first)
                lincs = list()
                devices = DevicesArrey.all()
                for device_item  in devices:
                    device:IDevice = device_item.device
                    if device.get_type_command()==ReceivedDataFormat.JSON:
                        if(device.get_address()==topic or (device.get_address()==first and last == "set")):
                            lincs.append({
                            "device": device.dict()
                            })
                    else:
                        fields = device.get_fields()
                        for devValue in fields:
                            if ((device.get_address() + "/" + devValue.get_address()==topic) and last != "set"):
                                lincs.append({
                                "device": device.dict(),
                                "field": devValue.dict()
                                })
                item["lincs"] = lincs
                if(last == "set"):
                    item["set"] = True
                newArr.append(item)

            return newArr
        except AttributeError as e:
            logger.error(f'getTopicksAndLinc -> error attribute. detail:{e}')
            return None
        except KeyError as e:
            logger.error(f'getTopicksAndLinc -> error key. detail:{e}')
            return None
