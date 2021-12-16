from django.conf import settings

from ..classes.devicesArrey import DevicesArrey
from .deviceControl.system.variable import Variable
from .Device import Devices

from castom_moduls import getDevicesClass

import json
import ast

devicesArrey = DevicesArrey()

def confdecod(data):
    arr2 = []
    for element in data.values:
        arr2.append(element.get())
    return arr2

def device(item):
    systemName = item.systemName
    typeConnect = item.typeConnect
    dev = None
    status = "offline"
    try:
        if(not item.status):
            control = item.control
            return {
            **item.getDict(),
            "config":confdecod(item),
            "value":None,
            "status":"unlink"
            }
        element = devicesArrey.get(systemName)
        if(not element):
            if(typeConnect == "variable"):
                dev = Variable(systemName=systemName)
            else:
                dev = getDevicesClass(typeConnect, systemName)
            if(not dev.get_device()):
                return {
                **dev.get_Base_Info(),
                "status":"offline"
                }
            devicesArrey.addDevice(systemName,dev)

        else:
            status = "online"
            dev = element["device"]
        return {
        **dev.get_All_Info(),
        "status":status
        }

    except Exception as e:
        logger.info(f'device not found. {e}')
        el = devicesArrey.get(item.systemName)
        if(el):
            dev = el['device']
            devicesArrey.delete(item.systemName)
            return {
                **dev.get_Base_Info(),
                "status":"offline"
            }
        return None

def giveDevice(systemName):
    dev = Devices.get(systemName=systemName)
    return device(dev)

def giveDevices():
    devices = Devices.all()
    arr = []
    for item in devices:
        dev = device(item)
        arr.append(dev)
    return arr
