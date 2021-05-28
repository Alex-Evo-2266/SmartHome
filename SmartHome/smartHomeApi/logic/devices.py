from django.conf import settings
from ..models import Device,ValueDevice,Room,genId
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

# from ..tasks import updataDataDevice

import json
import ast


devicesArrey = DevicesArrey()

def confdecod(data):
    arr2 = []
    for element in data.valuedevice_set.all():
        arr2.append(element.receiveDictConf())
    return arr2

def addDevice(data):
    try:
        devices = Device.objects.all()
        for item in devices:
            if item.DeviceSystemName==data.get("systemName"):
                return False
        newDevice = Device.objects.create(id=genId(Device.objects.all()),DeviceName=data.get("name"), DeviceSystemName=data.get("systemName"), DeviceType=data.get("typeDevice"),DeviceTypeConnect=data.get("typeConnect"),DeviceAddress=data.get("address"),DeviceValueType=data.get("typeValue"))
        if "token" in data:
            newDevice.DeviceToken=data.get("token")
        newDevice.save()
        if(data.get("typeValue")=="json"):
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=newDevice,type=item["type"])
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
                val.save()
            return True
        else:
            conf = data["config"]
            for item in conf:
                val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=newDevice,type=item["type"], address=item["address"])
                val.value="0"
                if "low" in item:
                    val.low=item["low"]
                    val.value=item["low"]
                if "high" in item:
                    val.high=item["high"]
                if "icon" in item:
                    val.icon=item["icon"]
                val.save()
            return True
    except Exception as e:
        print("error device add",e)
        return False

def device(item):
    try:
        element = devicesArrey.get(item.id)
        status = "offline"

        if not element:
            dev = ControlDevices(item.receiveDict(),{"address":item.DeviceAddress, "token":item.DeviceToken},confdecod(item))
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
                "DeviceConfig":confdecod(item),
                "DeviceControl":ast.literal_eval(control),
                "DeviceValue":None,
                "status":"offline"
                }
        element["device"].get_value()

        if element:
            status = "online"

        return {
        **item.receiveDict(),
        "DeviceConfig":confdecod(item),
        "DeviceControl":ast.literal_eval(item.DeviceControl),
        "DeviceValue":item.get_value(),
        "status":status
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
    # updataDataDevice.delay()
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
        if(data["DeviceType"]!="variable"):
            dev.DeviceAddress = data["DeviceAddress"]
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
            deviceSetStatus(data["DeviceId"],"value",data["DeviceValue"])
        dev.save()
        vals = ValueDevice.objects.filter(device__id=data["DeviceId"])
        print(data)
        if("config" in data):
            for item in vals:
                item.delete()
            if(data.get("DeviceValueType")=="json"):
                conf = data["config"]
                for item in conf:
                    val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,type=item["type"])
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
                    val.save()
                return True
            else:
                conf = data["config"]
                for item in conf:
                    val = ValueDevice.objects.create(id=genId(ValueDevice.objects.all()),device=dev,type=item["type"], address=item["address"])
                    val.value="0"
                    if "low" in item:
                        val.low=item["low"]
                        val.value=item["low"]
                    if "high" in item:
                        val.high=item["high"]
                    if "icon" in item:
                        val.icon=item["icon"]
                    val.save()
                return True
        devicesArrey.delete(data["DeviceId"])
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
