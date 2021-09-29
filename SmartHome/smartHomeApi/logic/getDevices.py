from django.conf import settings
from ..models import Device,ValueDevice,Room,genId
from yeelight import BulbException

from ..classes.devicesArrey import DevicesArrey


from .deviceControl.DeviceClass.Yeelight import Yeelight
from .deviceControl.DeviceClass.MQTTDevice import MQTTDevice

import json
import ast


devicesArrey = DevicesArrey()

def confdecod(data):
    arr2 = []
    for element in data.valuedevice_set.all():
        arr2.append(element.receiveDictConf())
    return arr2

def device(item):
    id = item.id
    typeConnect = item.DeviceTypeConnect
    dev = None
    status = "offline"
    try:
        if(not item.DeviceStatus):
            control = item.DeviceControl
            return {
            **item.receiveDict(),
            "DeviceConfig":confdecod(item),
            "DeviceValue":None,
            "status":"unlink"
            }
        element = devicesArrey.get(id)
        if(not element):
            if(typeConnect == "yeelight"):
                dev = Yeelight(id=id)
            if(typeConnect == "mqtt"):
                dev = MQTTDevice(id=id)
            if(not dev.get_device()):
                return {
                **dev.get_Base_Info(),
                "status":"offline"
                }
            devicesArrey.addDevice(id,dev)

        else:
            status = "online"
            dev = element["device"]
        return {
        **dev.get_All_Info(),
        "status":status
        }

    except Exception as e:
        print("error device",e)
        el = devicesArrey.get(item.id)
        if(el):
            dev = el['device']
            devicesArrey.delete(item.id)
            return {
                **dev.get_Base_Info(),
                "status":"offline"
            }
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
