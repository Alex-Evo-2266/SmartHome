from ..classes.devicesArrey import DevicesArrey
from SmartHome.settings import DEVICES
from smartHomeApi.logic.Cart import deleteDeviceCart
from smartHomeApi.logic.utils.file import readYMLFile, writeYMLFile
from .Device import Devices

import json
import ast
import logging

logger = logging.getLogger(__name__)

devicesArrey = DevicesArrey()

def addDevice(data):
    try:
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        logger.debug(f'addDevice input data:{data}, file:{devices}')
        for item in devices:
            if item["systemName"]==data.get("systemName"):
                return {"status":'error', "detail":"a device with the same name already exists."}
        newDevice = Devices.create(name=data.get("name"), systemName=data.get("systemName"), type=data.get("type"),typeConnect=data.get("typeConnect"),address=data.get("address"),valueType=data.get("valueType"))
        if "DeviceToken" in data:
            newDevice.token=data.get("token")
        conf = data["config"]
        for item in conf:
            val = newDevice.addField(name=item["name"])
            val.value="0"
            if "address" in item:
                val.address=item["address"]
            if "low" in item:
                val.low=item["low"]
                val.value=item["low"]
            if "high" in item:
                val.high=item["high"]
            if "icon" in item:
                val.icon=item["icon"]
            if "values" in item:
                val.values=item["values"]
            if "control" in item:
                val.control=item["control"]
            if "unit" in item:
                val.unit=item["unit"]
            if "type" in item:
                val.type=item["type"]
        newDevice.save()
        return {"status":'ok'}
    except Exception as e:
        logger.error(f'error add device, detail:{e}')
        return {"status":'error', "detail":e}

def giveSystemNameDeviceByAddres(address):
    devices = Devices.all()
    arr = list()
    for item in devices:
        if(item.address == address):
            arr.append(item.systemName)
    return arr

def editAdress(systemName, newadress):
    dev = Devices.get(systemName=systemName)
    dev.address = newadress
    dev.save()
    devicesArrey.delete(systemName)


def editDevice(data):
    try:
        logger.debug(f'edit device, input data:{data}')
        devices = Devices.all()
        for item in devices:
            if item.systemName==data.get("newSystemName") and data.get("systemName") != data.get("newSystemName"):
                return {"status":'error', "detail":"a device with the same name already exists."}
        dev = Devices.get(data.get("systemName"))
        dev.name = data["name"]
        dev.information = data["information"]
        dev.type = data["type"]
        if(data["type"]!="variable"):
            dev.address = data["address"]
        if("valueType" in data):
            dev.valueType = data["valueType"]
        if "token" in data:
            dev.token = data["token"]
        dev.typeConnect = data["typeConnect"]
        dev.control = ""
        dev.save()
        if("newSystemName" in data):
            dev.editSysemName(data["newSystemName"])
        devicesArrey.delete(data["systemName"])

        if("config" in data):
            dev.values = []
            conf = data["config"]
            for item in conf:
                val = dev.addField(name=item["name"])
                val.value="0"
                if "address" in item:
                    val.address=item["address"]
                if "low" in item:
                    val.low=item["low"]
                    val.value=item["low"]
                if "high" in item:
                    val.high=item["high"]
                if "icon" in item:
                    val.icon=item["icon"]
                if "values" in item:
                    val.values=item["values"]
                if "unit" in item:
                    val.unit=item["unit"]
                if "control" in item:
                    val.control=item["control"]
                if "type" in item:
                    val.type=item["type"]
            dev.save()
            return {"status":'ok'}
        return {"status":'ok'}
    except Exception as e:
        logger.error(f"error edit device. detail:{e}")
        return {"status":'error', "detail":e}

def deleteDevice(systemName):
    try:
        dev = Devices.get(systemName=systemName)
        devicesArrey.delete(systemName)
        dev.delete()
        deleteDeviceCart(systemName)
        logger.info(f'delete device, systemName:{systemName}')
        return {"status":'ok'}
    except Exception as e:
        logger.error(f'error delete device, detail:{e}')
        return {"status":'error', "detail":e}
