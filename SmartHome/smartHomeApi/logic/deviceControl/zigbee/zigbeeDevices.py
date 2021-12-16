zigbeeDevices = []
permit_join = False
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from smartHomeApi.logic.config.configget import getConfig
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.logic.editDevice import giveSystemNameDeviceByAddres, deleteDevice, editAdress
import json, logging

logger = logging.getLogger(__name__)

def zigbeeInfoSearch(topic, message):
    zigbee = getConfig("zigbee2mqtt")
    last = topic.split('/')[-1]
    first = topic.split('/')[0:-1]
    first = "/".join(first)
    if(topic == '/'.join([zigbee["topic"],"bridge","response","device","rename"])):
        editAdressLincDevices(json.loads(message))
    if(topic == '/'.join([zigbee["topic"],"bridge","response","device","remove"])):
        decodRemove(json.loads(message))
    if(topic == '/'.join([zigbee["topic"],"bridge","event"])):
        decodEvent(json.loads(message))
    if ("/".join(topic.split('/')[0:2])=='/'.join([zigbee["topic"],"bridge"])):
        if(last=="devices"):
            decodeZigbeeDevices(json.loads(message))
        if(last=="info"):
            decodeZigbeeConfig(json.loads(message))

def decodEvent(data):
    global zigbeeDevices
    newdata = data["data"]
    newdata = formatDev(newdata)
    if(data["type"]=="device_interview"):
        sendData("connect_device",newdata)
    if(data["type"]=="device_joined"):
        sendData("start_connect",newdata)
    if(data["type"]=="device_leave"):
        sendData("leave",newdata)
    if(data["type"]=="device_announce"):
        sendData("announced",newdata)
        for item in zigbeeDevices:
            if(item["id"]==newdata["address"]):
                sendData("newZigbeesDevice",item["data"])





def decodRemove(data):
    if(data["status"]=="ok"):
        pass
    elif(data["status"]=="error"):
        logger.error(data["error"])

def editAdressLincDevices(data):
    zigbee = getConfig("zigbee2mqtt")
    oldadress = data["data"]
    oldadress = oldadress["from"]
    newadress = data["data"]
    newadress = newadress["to"]
    address = '/'.join([zigbee["topic"],oldadress])
    devs = giveSystemNameDeviceByAddres(address)
    newadress = '/'.join([zigbee["topic"],newadress])
    for name in devs:
        editAdress(name,newadress)

def addzigbeeDevices(id,data):
    global zigbeeDevices
    dev = dict()
    a=True
    for item in zigbeeDevices:
        if(item["id"]==id):
            item["data"]=data
            a=False
    if(a):
        dev["id"] = id
        dev["data"] = data
        zigbeeDevices.append(dev)



def getzigbeeDevices():
    global zigbeeDevices
    return zigbeeDevices

def getPermitJoin():
    global permit_join
    return permit_join

def decodeZigbeeDevices(data):
    try:
        config = getConfig("zigbee2mqtt")
        global zigbeeDevices
        zigbeeDevices = []
        for item in data:
            dev = formatDev(item)
            addzigbeeDevices(dev["address"],dev)
        sendData("zigbee",zigbeeDevices)
    except Exception as e:
        logger.error(f'zigbee devices decod {e}')

def formatDev(item):
    config = getConfig("zigbee2mqtt")
    d = None
    if("definition" in item):
        d = item["definition"]
    dev = dict()
    dev["name"] = item["friendly_name"]
    dev["root_address"] = config
    dev["address"] = item["ieee_address"]
    dev["allAddress"] = config["topic"]+"/"+item["friendly_name"]
    if("type" in item):
        dev["type"] = item["type"]
    if "power_source" in item:
        dev["power_source"] = item["power_source"]
    if(d and ("model" in d)):
        dev["model"] = d["model"]
        dev["description"] = d["description"]
        dev["vendor"] = d["vendor"]
        if("exposes" in d):
            dev["exposes"] = d["exposes"]
    return dev

def decodeZigbeeConfig(data):
    global permit_join
    permit_join = data["permit_join"]
