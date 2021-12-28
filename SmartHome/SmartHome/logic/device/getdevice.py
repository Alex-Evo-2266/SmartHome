from .devicesArrey import devicesArrey
from .DeviceFile import Devices

from SmartHome.schemas.device import DeviceSchema, DeviceFieldConfigSchema
from castom_moduls import getDevicesClass

import json
import ast, logging

logger = logging.getLogger(__name__)

def confdecod(elements):
    arr2 = []
    for element in elements:
        arr2.append(
            DeviceFieldConfigSchema(
                **element.get()
            )
        )
    return arr2

def confdecod2(elements):
    arr2 = []
    for element in elements:
        arr2.append(
            DeviceFieldConfigSchema(
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
            control = item.control
            data = item.getDict()
            data.pop('config', None)
            data.pop('status', None)
            return DeviceSchema(
                **data,
                config=confdecod(item.values),
                value=None,
                status="unlink"
            )
        element = devicesArrey.get(systemName)
        if(not element):
            dev = await getDevicesClass(typeConnect, systemName)
            if(not dev.get_device()):
                data = dev.get_Base_Info()
                config = data['config']
                data.pop('config', None)
                data.pop('status', None)
                return DeviceSchema(
                    **data,
                    config=confdecod2(config),
                    status="offline"
                )
            devicesArrey.addDevice(systemName,dev)

        else:
            status = "online"
            dev = element["device"]
        data = dev.get_All_Info()
        config = data['config']
        data.pop('config', None)
        data.pop('status', None)
        return DeviceSchema(
            **data,
            config=confdecod2(config),
            status=status
        )
    except Exception as e:
        logger.warning(f'device not found. {e}')
        el = devicesArrey.get(item.systemName)
        if(el):
            dev = el['device']
            devicesArrey.delete(item.systemName)
            data = dev.get_Base_Info()
            config = data['config']
            data.pop('config', None)
            data.pop('status', None)
            return DeviceSchema(
                **data,
                config=confdecod2(config),
                status="offline"
            )
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
