zigbeeDevices = []
permit_join = False
from smartHomeApi.logic.config.configget import getConfig
from smartHomeApi.logic.editDevice import giveidDeviceByAddres, editAdress
import json

def zigbeeInfoSearch(topic, message):
    zigbee = getConfig("zigbee2mqtt")
    last = topic.split('/')[-1]
    first = topic.split('/')[0:-1]
    first = "/".join(first)
    if(topic == '/'.join([zigbee["topic"],"bridge","response","device","rename"])):
        editAdressLincDevices(json.loads(message))
    if ("/".join(topic.split('/')[0:2])=='/'.join([zigbee["topic"],"bridge"])):
        if(last=="devices"):
            decodeZigbeeDevices(json.loads(message))
        if(last=="info"):
            decodeZigbeeConfig(json.loads(message))

def editAdressLincDevices(data):
    zigbee = getConfig("zigbee2mqtt")
    oldadress = data["data"]
    oldadress = oldadress["from"]
    newadress = data["data"]
    newadress = newadress["to"]
    adress = '/'.join([zigbee["topic"],oldadress])
    devs = giveidDeviceByAddres(adress)
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
    # print(data)
    for item in data:
        # print("1",item,"\n")
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
                # for item2 in d["exposes"]:
                    # print(dev["name"],item2,"\n")
        # print(dev,"\n")
        addzigbeeDevices(dev["address"],dev)
        # print(item["friendly_name"])
        # d = item["definition"]

def decodeZigbeeConfig(data):
    print(data["permit_join"])
    global permit_join
    permit_join = data["permit_join"]
