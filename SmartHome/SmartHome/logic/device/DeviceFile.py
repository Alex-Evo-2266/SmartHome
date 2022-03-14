from SmartHome.settings import DEVICES
from SmartHome.logic.utils.file import readYMLFile, writeYMLFile
from SmartHome.schemas.device import DeviceSchema, DeviceFieldSchema

import json
import ast

def decodField(fields):
    arr = []
    for field in fields:
        arr.append(DeviceFieldSchema(**field))
    return arr

class Devices(object):
    def all():
        devices = readYMLFile(DEVICES)
        devs = list()
        if(devices == None):
            return devs
        for item in devices:
            item["fields"] = decodField(item["fields"])
            devs.append(Device(**item))
        return devs

    def get(systemName:str):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        for item in devices:
            if(item["systemName"] == systemName):
                item["fields"] = decodField(item["fields"])
                return Device(**item)
        return None

    def create(data: DeviceSchema):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        for item in devices:
            if(item["systemName"] == data.systemName):
                return None
        device = Device(**data.dict())
        device.save()
        return device


class Device(DeviceSchema):

    def editSysemName(self, newSystemName:str):
        devices = readYMLFile(DEVICES)
        for item in devices:
            if(item["systemName"] == self.systemName):
                item["systemName"] = newSystemName
        writeYMLFile(DEVICES, devices)

    def save(self):
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        index = None
        for item in devices:
            if(item["systemName"] == self.systemName):
                index = devices.index(item)
                break
        if(index == None):
            devices.append(self.dict())
        else:
            devices[index] = self.dict()
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

    def addField(self, data: DeviceFieldSchema):
        self.fields.append(data)
        return data

    def get_value(self):
        values = self.values
        valuesDict = dict()
        for item in values:
            valuesDict[item.name]=item.value
        return valuesDict
