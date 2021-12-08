from smartHomeApi.logic.config.configget import getConfig
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.logic.Device import Devices
import ast
import json
mqttTopics = []

def getIdTopic(topic):
    global mqttTopics
    for item in mqttTopics:
        if(item["topic"]==topic):
            return mqttTopics.index(item)

def addTopic(topic,message):
    global mqttTopics
    t = {
        "topic":topic,
        "message":message
    }
    id = getIdTopic(topic)
    print("send",topic)
    if(id != None):
        mqttTopics[id] = t
    else:
        mqttTopics.append(t)
    sendData("mqtt",mqttTopics)
    return t

def getTopicksAll():
    global mqttTopics
    return mqttTopics

def getTopicksAndLinc():
    topics = getTopicksAll()
    newArr = list()
    for item in topics:
        topic = item["topic"]
        last = topic.split('/')[-1]
        first = topic.split('/')[0:-1]
        first = "/".join(first)
        zigbee = getConfig("zigbee2mqtt")
        # if ("/".join(topic.split('/')[0:2])=='/'.join([zigbee["topic"],"bridge"]) and last!="state"):
        #     if(last=="devices"):
        #         decodeZigbeeDevices(json.loads(item["message"]))
        #     if(last=="info"):
        #         decodeZigbeeConfig(json.loads(item["message"]))
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

def ClearTopicks():
    global mqttTopics
    mqttTopics = []
