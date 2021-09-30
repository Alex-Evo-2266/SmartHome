zigbeeDevices = []
permit_join = False
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from smartHomeApi.logic.config.configget import getConfig
from smartHomeApi.logic.socketOut import sendData
from smartHomeApi.logic.editDevice import giveidDeviceByAddres, deleteDevice, editAdress
import json

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
    if(data["type"]=="device_leave"):
        global zigbeeDevices
        address = data["data"]
        address = address["ieee_address"]
        for item in zigbeeDevices:
            if item["address"] == address:
                devs = giveidDeviceByAddres(item["name"])
                for id in devs:
                    deleteDevice(id)
                return



def decodRemove(data):
    if(data["status"]=="ok"):
        pass
    elif(data["status"]=="error"):
        print(data["error"])

def editAdressLincDevices(data):
    zigbee = getConfig("zigbee2mqtt")
    oldadress = data["data"]
    oldadress = oldadress["from"]
    newadress = data["data"]
    newadress = newadress["to"]
    address = '/'.join([zigbee["topic"],oldadress])
    devs = giveidDeviceByAddres(address)
    newadress = '/'.join([zigbee["topic"],newadress])
    for id in devs:
        editAdress(id,newadress)

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
    config = getConfig("zigbee2mqtt")
    global zigbeeDevices
    zigbeeDevices = []
    for item in data:
        d = item["definition"]
        dev = dict()
        dev["name"] = item["friendly_name"]
        dev["address"] = item["ieee_address"]
        dev["allAddress"] = config["topic"]+"/"+item["friendly_name"]
        dev["type"] = item["type"]
        if "power_source" in item:
            dev["power_source"] = item["power_source"]
        if(d and ("model" in d)):
            dev["model"] = d["model"]
            dev["vendor"] = d["vendor"]
            if("exposes" in d):
                dev["exposes"] = d["exposes"]
        addzigbeeDevices(dev["address"],dev)
    sendData("zigbee",zigbeeDevices)

def decodeZigbeeConfig(data):
    print(data["permit_join"])
    global permit_join
    permit_join = data["permit_join"]
