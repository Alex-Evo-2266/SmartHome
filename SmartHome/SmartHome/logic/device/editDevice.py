import logging

from .devicesArrey import devicesArrey
# from smartHomeApi.logic.Cart import deleteDeviceCart
from ..utils.file import readYMLFile, writeYMLFile
from .DeviceFile import Devices

from settings import DEVICES
from SmartHome.schemas.device import DeviceSchema, DeviceFieldSchema, DeviceEditSchema

from SmartHome.logic.homePage import deleteDevice as deleteDeviceinpage
from SmartHome.schemas.base import FunctionRespons, TypeRespons

logger = logging.getLogger(__name__)

async def editDevice(data: DeviceEditSchema):
    try:
        logger.debug(f'edit device, input data:{data}')
        devices = Devices.all()
        for item in devices:
            if item.systemName==data.newSystemName and data.systemName != data.newSystemName:
                return FunctionRespons(status=TypeRespons.INVALID, detail="a device with the same name already exists.")
        dev = Devices.get(data.systemName)
        dev.name = data.name
        dev.information = data.information
        dev.type = data.type
        dev.address = data.address
        dev.valueType = data.valueType
        dev.token = data.token
        dev.typeConnect = data.typeConnect
        dev.fields = []
        dev.save()

        if(data.fields):
            conf = data.fields
            for item in conf:
                dev.addField(DeviceFieldSchema(
                    address=item.address,
                    name=item.name,
                    value=item.low,
                    type=item.type,
                    low=item.low,
                    high=item.high,
                    values=item.values,
                    control=item.control,
                    icon=item.icon,
                    unit=item.unit
                ))
            dev.save()
        if(data.newSystemName):
            dev.editSysemName(data.newSystemName)
        devicesArrey.delete(data.systemName)
        return FunctionRespons(status=TypeRespons.OK, data="ok")
    except Exception as e:
        logger.error(f"error edit device. detail:{e}")
        return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))

async def deleteDevice(systemName: str):
    try:
        dev = Devices.get(systemName=systemName)
        devicesArrey.delete(systemName)
        await dev.delete()
        deleteDeviceinpage(systemName)
        logger.info(f'delete device, systemName:{systemName}')
        return FunctionRespons(status=TypeRespons.OK, data="ok")
    except Exception as e:
        logger.error(f'error delete device, detail:{e}')
        return FunctionRespons(status=TypeRespons.ERROR, detail=e)

async def editStatusDevice(systemName: str, status: bool):
    try:
        dev = Devices.get(systemName=systemName)
        if(not dev):
            return FunctionRespons(status=TypeRespons.INVALID, detail="device not found")
        dev.status = status
        dev.save()
        logger.info(f'edit status device, systemName:{systemName}')
        return FunctionRespons(status=TypeRespons.OK, data="ok")
    except Exception as e:
        logger.error(f'error edit status device, detail:{e}')
        return FunctionRespons(status=TypeRespons.ERROR, detail=e)
