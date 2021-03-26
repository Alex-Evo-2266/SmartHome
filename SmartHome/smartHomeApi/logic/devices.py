from django.conf import settings
from ..models import Device,ConfigDevice,Room,genId
from .deviceControl.mqttDevice.classDevices.dimmer import MqttDimmer
from .deviceControl.mqttDevice.classDevices.device import MqttDevice
from .deviceControl.mqttDevice.classDevices.light import MqttLight
from .deviceControl.mqttDevice.classDevices.relay import MqttRelay
from .deviceControl.mqttDevice.classDevices.sensor import MqttSensor
from .deviceControl.SmartHomeDevice import ControlDevices
from yeelight import BulbException
# from DeviceControl.miioDevice.control import is_device,lamp
from .deviceValue import deviceSetStatus

from ..classes.devicesArrey import DevicesArrey

import json
import ast


devicesArrey = DevicesArrey()

def confdecod(data):
    arr2 = []
    for element in data:
        arr2.append(element.receiveDict())
    return arr2

def addDevice(data):
    try:
        # if data.get("typeConnect")=="miio":
        #     for item in data["config"]:
        #         if item["type"]=="base":
                    # confirmation = is_device(item["address"],item["token"])
                    # if confirmation["type"]=="error":
                    #     return False
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
    try:
        element = devicesArrey.get(item.id)
        if not element:
            dev = ControlDevices(item.receiveDict(),confdecod(item.configdevice_set.all()))
            print("device",dev)
            if dev.get_device():
                devicesArrey.addDevice(item.id,dev)
                element = devicesArrey.get(item.id)
                item.DeviceControl = str(element["device"].get_control())
                item.save()
            else:
                control = item.DeviceControl
                if(control==""):
                    control="{}"
                return {
                **item.receiveDict(),
                "DeviceConfig":confdecod(item.configdevice_set.all()),
                "DeviceControl":ast.literal_eval(control),
                "DeviceValue":None,
                "status":"offline"
                }
        return {
        **item.receiveDict(),
        "DeviceConfig":confdecod(item.configdevice_set.all()),
        "DeviceControl":ast.literal_eval(item.DeviceControl),
        "DeviceValue":element["device"].get_value(),
        "status":"online"
        }

    except Exception as e:
        print("error device",e)
        el = devicesArrey.get(item.id)
        if(el):
            devicesArrey.delete(item.id)
        return None


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
        if data["DeviceType"] != "miio":
            dev.DeviceControl = ""
        if("RoomId" in data and data["RoomId"]):
            room = Room.objects.get(id=data["RoomId"])
            dev.room = room
        if("DeviceValue" in data):
            deviceSetStatus(data["DeviceId"],"value",data["DeviceValue"])
        dev.save()
        configs = ConfigDevice.objects.filter(device__id=data["DeviceId"])
        if("config" in data):
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
                if "token" in item:
                    conf.token=item["token"]
                conf.save()
        devicesArrey.delete(data["DeviceId"])
        # devi = ControlDevices(dev.receiveDict(),confdecod(dev.configdevice_set.all()))
        # devicesArrey.addDevice(data["DeviceId"],devi)
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
