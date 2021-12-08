from SmartHome.settings import DEVICES
from smartHomeApi.logic.utils.file import readYMLFile, writeYMLFile

import json
import ast

class Devices(object):
    def all():
        devices = readYMLFile(DEVICES)
        devs = list()
        if(devices == None):
            return devs
        for item in devices:
            devs.append(Device(**item))
        return devs

    def get(systemName):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        for item in devices:
            if(item["systemName"] == systemName):
                return Device(**item)
        return None

    def create(*args, **kwargs):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        for item in devices:
            if(item["systemName"] == kwargs["systemName"]):
                return None
        device = Device(**kwargs)
        device.save()
        return device


class Device(object):
    def __init__(self, *args, **kwargs):
        self.name = kwargs["name"]
        self.systemName = kwargs["systemName"]
        self.type = kwargs["type"]
        self.typeConnect = kwargs["typeConnect"]
        self.address = kwargs["address"]
        self.valueType = kwargs["valueType"]
        self.values = []
        self.token = None
        self.status = True
        self.RoomId = None
        self.information = ""
        if("status" in kwargs):
            self.status = kwargs["status"]
        if("information" in kwargs):
            self.information = kwargs["information"]
        if("values" in kwargs):
            for item in kwargs["values"]:
                self.addField(**item)

    def editSysemName(self, newSystemName):
        devices = readYMLFile(DEVICES)
        for item in devices:
            if(item["systemName"] == self.systemName):
                item["systemName"] = newSystemName
        writeYMLFile(DEVICES, devices)

    def save(self):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        flag = False
        values = []
        for item in self.values:
            values.append(item.get())
        for item in devices:
            if(item["systemName"] == self.systemName):
                item["name"] = self.name
                item["type"] = self.type
                item["typeConnect"] = self.typeConnect
                item["address"] = self.address
                item["valueType"] = self.valueType
                item["token"] = self.token
                item["values"] = values
                flag = True
                break
        if(not flag):
            devices.append({
            "systemName": self.systemName,
            "name": self.name,
            "type": self.type,
            "typeConnect": self.typeConnect,
            "address": self.address,
            "valueType": self.valueType,
            "values": values,
            })
        writeYMLFile(DEVICES, devices)

    def delete(self):
        devices = readYMLFile(DEVICES)
        device = None
        for item in devices:
            if(item["systemName"] == self.systemName):
                device = item
                break
        if(device):
            devices.remove(device)
        writeYMLFile(DEVICES, devices)

    def addField(self, *args, **kwargs):
        field = Field(**kwargs)
        self.values.append(field)
        return field

    def getDict(self):
        return {
            "status":self.status,
            "name":self.name,
            "systemName":self.systemName,
            "information":self.information,
            "type":self.type,
            "typeConnect":self.typeConnect,
            "valueType":self.valueType,
            "address":self.address,
            "token":self.token,
            "RoomId":self.RoomId
        }

    def get_value(self):
        values = self.values
        valuesDict = dict()
        for item in values:
            valuesDict[item.name]=item.value
        return valuesDict

class Field(object):
    """docstring for Field."""

    def __init__(self, *args, **kwargs):
        self.name = kwargs["name"]
        self.value = "0"
        self.control = False
        self.unit = ""
        self.icon = ""
        self.address = ""
        self.low = 0
        self.high = 100
        self.type = ""
        self.values = ""
        if("value" in kwargs):
            self.value = kwargs["value"]
        if("control" in kwargs):
            self.control = kwargs["control"]
        if("unit" in kwargs):
            self.unit = kwargs["unit"]
        if("icon" in kwargs):
            self.icon = kwargs["icon"]
        if("address" in kwargs):
            self.address = kwargs["address"]
        if("low" in kwargs):
            self.low = kwargs["low"]
        if("high" in kwargs):
            self.high = kwargs["high"]
        if("type" in kwargs):
            self.type = kwargs["type"]
        if("values" in kwargs):
            self.values = kwargs["values"]


    def get(self):
        return{
        "name": self.name,
        "address": self.address,
        "value": self.value,
        "low":self.low,
        "high":self.high,
        "icon":self.icon,
        "values":self.values,
        "control":self.control,
        "unit":self.unit,
        "type":self.type,
        }
