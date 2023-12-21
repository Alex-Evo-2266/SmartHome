# from SmartHome.logic.server.modulesconfig import configManager
from typing import List
from app.device.enums import ReceivedDataFormat
from app.websocket import WebSocketMenager
from app.device.models import Device, Device_field
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
    mqttTopics = {}

    @staticmethod
    def clear():
        TopicHistory.mqttTopics = {}

    @staticmethod
    async def add(topic,message):
        t = {
            "topic":topic,
            "message":message
        }
        TopicHistory.mqttTopics[topic] = t
        await WebSocketMenager.send_information("mqtt",dict_to_list(TopicHistory.mqttTopics))
        return t

    @staticmethod
    def all():
        return dict_to_list(TopicHistory.mqttTopics)

    @staticmethod
    def getTopicksAndLinc():
        try:
            topics = dict_to_list(TopicHistory.mqttTopics)
            newArr = list()
            for item in topics:
                topic:str = item["topic"]
                last = topic.split('/')[-1]
                first = topic.split('/')[0:-1]
                first = "/".join(first)
                lincs = list()
                devices:List[Device] = Device.objects.all()
                for device in devices:
                    if device.type_command==ReceivedDataFormat.JSON:
                        if(device.address==topic or (device.address==first and last == "set")):
                            lincs.append({
                            "device": device.dict()
                            })
                    else:
                        fields: List[Device_field] = Device_field.objects.all(device=device)
                        for devValue in fields:
                            if ((device.address + "/" + devValue.address==topic) and last != "set"):
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
