import logging

from SmartHome.logic.server.modulesconfig import configManager
from SmartHome.logic.device.devicesArrey import devicesArrey
from SmartHome.logic.device.DeviceFile import Devices
from .schemas import ZigbeeDeviceSchema
import json

async def editAdressLincDevices(obj, topic, message):
    data = json.loads(message)
    zigbee = configManager.getConfig("zigbee2mqtt")
    oldadress = data["data"]
    oldadress = oldadress["from"]
    newadress = data["data"]
    newadress = newadress["to"]
    address = '/'.join([zigbee["topic"],oldadress])
    devs = Devices.all()
    devs2 = devs
    for item in devs2:
        if item.address != address:
            devs.remove(item)
    newadress = '/'.join([zigbee["topic"],newadress])
    for item in devs:
        item.address = newadress
        item.save()

async def decodRemove(obj, topic, message):
    data = json.loads(message)
    if(data["status"]=="ok"):
        pass
    elif(data["status"]=="error"):
        logger.error(data["error"])


def formatDev(item):
    config = configManager.getConfig("zigbee")
    d = {}
    if("definition" in item):
        d = item["definition"]
    dev = ZigbeeDeviceSchema(
        name=item["friendly_name"],
        root_address=config["topic"],
        address=item["ieee_address"],
        allAddress=config["topic"]+"/"+item["friendly_name"]
    )
    if("type" in item):
        dev.type = item["type"]
    if "power_source" in item:
        dev.power_source = item["power_source"]
    if(d and ("model" in d)):
        dev.model = d["model"]
        dev.description = d["description"]
        dev.vendor = d["vendor"]
        if("exposes" in d):
            dev.exposes = d["exposes"]
    return dev
