# from SmartHome.logic.server.modulesconfig import configManager
from SmartHome.websocket.manager import manager
from SmartHome.logic.device.DeviceFile import Devices
import ast
import json
import logging

logger = logging.getLogger(__name__)

def dict_to_list(data):
    arr = list()
    for key in data:
        arr.append(data[key])
    return arr

class TopicHistory():

    def __init__(self):
        self.mqttTopics = {}

    def clear(self):
        self.mqttTopics = {}

    async def add(self,topic,message):
        t = {
            "topic":topic,
            "message":message
        }
        self.mqttTopics[topic] = t
        await manager.send_information("mqtt",dict_to_list(self.mqttTopics))
        return t

    def all(self):
        return dict_to_list(self.mqttTopics)

    def getTopicksAndLinc(self):
        try:
            topics = dict_to_list(self.mqttTopics)
            newArr = list()
            for item in topics:
                topic = item["topic"]
                last = topic.split('/')[-1]
                first = topic.split('/')[0:-1]
                first = "/".join(first)
                lincs = list()
                for device in Devices.all():
                    if device.valueType=="json":
                        if(device.address==topic or (device.address==first and last == "set")):
                            lincs.append({
                            "device": device.getDict()
                            })
                    else:
                        for devValue in device.values:
                            if ((device.address + "/" + devValue.address ==topic) and last != "set"):
                                lincs.append({
                                "device": device.getDict(),
                                "field": devValue.get()
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
