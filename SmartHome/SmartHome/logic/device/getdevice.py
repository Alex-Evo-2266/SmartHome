from .devicesArrey import devicesArrey
from .DeviceFile import Devices

from SmartHome.schemas.device import DeviceSchema, DeviceFieldSchema
from SmartHome.logic.device.BaseDeviceClass import BaseDevice
from SmartHome.logic.device.VariableClass import Variable
from castom_moduls import getDevicesClass

import json
import ast, logging

logger = logging.getLogger(__name__)

def confdecod(elements):
    arr2 = []
    for element in elements:
        arr2.append(element.getData())
    return arr2

def confdecod2(elements):
    arr2 = []
    for element in elements:
        arr2.append(
            DeviceFieldSchema(
                **element
            )
        )
    return arr2

async def device(item):
    systemName = item.systemName
    typeConnect = item.typeConnect
    dev = None
    status = "offline"
    try:
        if(not item.status):
            # control = item.control
            data = item.dict()
            data['fields']=confdecod(item.values),
            data['value']=dict()
            data['status']="unlink"
            return DeviceSchema(**data)
        element = devicesArrey.get(systemName)
        if(not element):
            if typeConnect == 'variable':
                dev = Variable(systemName=systemName)
            else:
                dev = await getDevicesClass(typeConnect, systemName)
            if(not dev):
                dev = BaseDevice(systemName=systemName)
                data = dev.get_Base_Info()
                data.status = "not supported"
                return data
            if(not dev.get_device()):
                data = dev.get_Base_Info()
                data.status="offline",
                return data
            devicesArrey.addDevice(systemName,dev)
        else:
            status = "online"
            dev = element["device"]
        data = dev.get_All_Info()
        data.status = status
        return data
    except Exception as e:
        logger.warning(f'device not found. {e}')
        el = devicesArrey.get(item.systemName)
        if(el):
            dev = el['device']
            devicesArrey.delete(item.systemName)
            data = dev.get_Base_Info()
            data.status="offline",
            return data
        return None

async def giveDevice(systemName):
    dev = Devices.get(systemName=systemName)
    return await device(dev)

async def giveDevices():
    devices = Devices.all()
    arr = []
    for item in devices:
        dev = await device(item)
        arr.append(dev)
    return arr
