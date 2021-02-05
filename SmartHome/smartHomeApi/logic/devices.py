from django.conf import settings
from ..models import Device,ConfigDevice,Room,genId
# from DeviceControl.miioDevice.control import is_device,lamp

import json

def addDevice(data):
    try:
        if data.get("typeConnect")=="miio":
            for item in data["config"]:
                if item["type"]=="base":
                    confirmation = is_device(item["address"],item["token"])
                    if confirmation["type"]=="error":
                        return False
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("systemName"):
                return False
        newDevice = Device.objects.create(id=genId(Device.objects.all()),DeviceName=data.get("name"), DeviceSystemName=data.get("systemName"), DeviceType=data.get("typeDevice"),DeviceTypeConnect=data.get("typeConnect"))
        newDevice.save()
        conf = data["config"]
        for item in conf:
            conf = ConfigDevice.objects.create(id=genId(ConfigDevice.objects.all()),device=newDevice,type=item["type"], address=item["address"])
            if "low" in item:
                conf.low=item["low"]
            if "token" in item:
                conf.token=item["token"]
            if "high" in item:
                conf.high=item["high"]
            if "icon" in item:
                conf.icon=item["icon"]
            conf.save()
        return True
    except:
        return False

def device(item):

    def confdecod(data):
        arr2 = []
        for element in data:
            arr2.append(element.receiveDict())
        return arr2
    return {
        **item.receiveDict(),
        "DeviceConfig":confdecod(item.configdevice_set.all())
    }

def deviceValue(id, type):
    dev = Device.objects.get(id=id)
    value = dev.valuedevice_set.all()
    print(value)
    for item in value:
        if item["type"]==type:
            return item["type"]


def giveDevice(id):
    dev = Device.objects.get(id=id)
    return device(dev)

def giveDevices():
    Devices = Device.objects.all()
    arr = []
    for item in Devices:
        dev = device(item)
        arr.append(dev)
    return arr

def editDevice(data):
    try:
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("DeviceSystemName") and item.id != data["DeviceId"]:
                return False
        dev = Device.objects.get(id=data["DeviceId"])
        dev.DeviceName = data["DeviceName"]
        dev.DeviceSystemName = data["DeviceSystemName"]
        dev.DeviceInformation = data["DeviceInformation"]
        dev.DeviceType = data["DeviceType"]
        dev.DeviceTypeConnect = data["DeviceTypeConnect"]
        if(data["RoomId"]):
            room = Room.objects.get(id=data["RoomId"])
            dev.room = room
        dev.save()
        configs = ConfigDevice.objects.filter(device__id=data["DeviceId"])
        for item in configs:
            item.delete()
        for item in data["config"]:
            conf = ConfigDevice.objects.create(id=genId(ConfigDevice.objects.all()),device=dev,type=item["type"], address=item["address"])
            if "low" in item:
                conf.low=item["low"]
            if "high" in item:
                conf.high=item["high"]
            if "icon" in item:
                conf.icon=item["icon"]
            conf.save()
        return True
    except:
        return False

def deleteDevice(id):
    try:
        dev = Device.objects.get(id=id)
        dev.delete()
        return True
    except:
        return False
