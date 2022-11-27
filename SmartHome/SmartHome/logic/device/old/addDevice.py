import json
import ast
import logging

from ..devicesArrey import devicesArrey
from ..utils.file import readYMLFile, writeYMLFile
from ..deviceFile.DeviceFile import Devices

from settings import DEVICES
# from SmartHome.logic.Cart import deleteDeviceCart
from SmartHome.schemas.base import FunctionRespons, TypeRespons
from SmartHome.schemas.device import DeviceSchema, DeviceFieldSchema

logger = logging.getLogger(__name__)

async def addDevice(data:DeviceSchema)->FunctionRespons:
    try:
        devices = readYMLFile(DEVICES)
        if devices == None:
            devices = list()
        logger.debug(f'addDevice input data:{data.dict()}, file:{devices}')
        for item in devices:
            if item["systemName"]==data.systemName:
                return FunctionRespons(status=TypeRespons.INVALID, detail="a device with the same name already exists.")
        fields = data.fields
        data.fields = []
        newDevice = Devices.create(data)
        for item in fields:
            item.value = item.low
            newDevice.addField(item)
        newDevice.save()
        return FunctionRespons(status=TypeRespons.OK, data="ok")
    except Exception as e:
        logger.error(f'error add device, detail:{e}')
        return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))
