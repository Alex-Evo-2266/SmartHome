from .devicesArrey import devicesArrey
from settings import DEVICES
# from smartHomeApi.logic.Cart import deleteDeviceCart
from schemas.device import DeviceSchema, DeviceFieldConfigSchema
from ..utils.file import readYMLFile, writeYMLFile
from .DeviceFile import Devices

import json
import ast
import logging

logger = logging.getLogger(__name__)

async def addDevice(data: DeviceSchema):
    try:
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        logger.debug(f'addDevice input data:{data.dict()}, file:{devices}')
        for item in devices:
            if item["systemName"]==data.systemName:
                return {"status":'error', "detail":"a device with the same name already exists."}
        newDevice = Devices.create(name=data.name, systemName=data.systemName, type=data.type,typeConnect=data.typeConnect,address=data.address,valueType=data.valueType)
        if data.token:
            newDevice.token=data.token
        conf = data.config
        for item in conf:
            val = newDevice.addField(name=item.name)
            val.value="0"
            if item.address:
                val.address=item.address
            if item.low:
                val.low=item.low
                val.value=item.low
            if item.high:
                val.high=item.high
            if item.icon:
                val.icon=item.icon
            if item.values:
                val.values=item.values
            if item.control:
                val.control=item.control
            if item.unit:
                val.unit=item.unit
            if item.type:
                val.type=item.type
        newDevice.save()
        return {"status":'ok'}
    except Exception as e:
        logger.error(f'error add device, detail:{e}')
        return {"status":'error', "detail":e}
