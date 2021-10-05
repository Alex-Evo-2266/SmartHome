from ..classes.devicesArrey import DevicesArrey
from ..models import Device,ValueDevice,Room,genId

import json
import ast

devicesArrey = DevicesArrey()

def addDevice(data):
    try:
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("DeviceSystemName"):
                return False
        newDevice = Device.objects.create(id=genId(Device.objects.all()),DeviceName=data.get("DeviceName"), DeviceSystemName=data.get("DeviceSystemName"), DeviceType=data.get("DeviceType"),DeviceTypeConnect=data.get("DeviceTypeConnect"),DeviceAddress=data.get("DeviceAddress"),DeviceValueType=data.get("DeviceValueType"))
        if "DeviceToken" in data:
            newDevice.DeviceToken=data.get("DeviceToken")
        newDevice.save()
        conf = data["config"]
        for item in conf:
            val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=newDevice,name=item["name"])
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
            val.save()
        return True
    except Exception as e:
        print("error device add",e)
        return False

def giveidDeviceByAddres(address):
    devices = Device.objects.all()
    arr = list()
    for item in devices:
        if(item.DeviceAddress == address):
            arr.append(item.id)
    return arr

def editAdress(id, newadress):
    dev = Device.objects.get(id=id)
    dev.DeviceAddress = newadress
    dev.save()
    devicesArrey.delete(id)


def editDevice(data):
    try:
        print(data)
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("DeviceSystemName") and item.id != data["DeviceId"]:
                return False
        print("f")
        dev = Device.objects.get(id=data["DeviceId"])
        dev.DeviceName = data["DeviceName"]
        dev.DeviceSystemName = data["DeviceSystemName"]
        dev.DeviceInformation = data["DeviceInformation"]
        dev.DeviceType = data["DeviceType"]
        if(data["DeviceType"]!="variable"):
            dev.DeviceAddress = data["DeviceAddress"]
        if("DeviceValueType" in data):
            dev.DeviceValueType = data["DeviceValueType"]
        if "DeviceToken" in data:
            dev.DeviceToken = data["DeviceToken"]
        dev.DeviceTypeConnect = data["DeviceTypeConnect"]
        if(data["DeviceType"] != "miio" or data["DeviceType"] != "yeelight"):
            dev.DeviceControl = ""
        if("RoomId" in data and data["RoomId"]):
            room = Room.objects.get(id=data["RoomId"])
            dev.room = room
        if("DeviceValue" in data):
            deviceSetStatusThread(data["DeviceId"],"value",data["DeviceValue"])
        dev.save()

        print(devicesArrey.all())
        devicesArrey.delete(data["DeviceId"])

        vals = ValueDevice.objects.filter(device__id=data["DeviceId"])
        if("config" in data):
            for item in vals:
                item.delete()
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,name=item["name"])
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
                val.save()
            return True
        return True
    except Exception as e:
        print(e)
        return False

def deleteDevice(id):
    try:
        print("q",id)
        dev = Device.objects.get(id=id)
        print("delete",dev)
        devicesArrey.delete(id)
        print("delete in arr")
        dev.delete()
        print("ok")
        return True
    except Exception as e:
        print("delete device error ",e)
        return False
