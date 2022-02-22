import logging

from .devicesArrey import devicesArrey
# from smartHomeApi.logic.Cart import deleteDeviceCart
from ..utils.file import readYMLFile, writeYMLFile
from .DeviceFile import Devices

from SmartHome.settings import DEVICES
from SmartHome.schemas.device import DeviceSchema, DeviceFieldConfigSchema, DeviceEditSchema

from SmartHome.logic.homePage import deleteDevice as deleteDeviceinpage


logger = logging.getLogger(__name__)

async def editDevice(data: DeviceEditSchema):
    try:
        logger.debug(f'edit device, input data:{data}')
        devices = Devices.all()
        for item in devices:
            if item.systemName==data.newSystemName and data.systemName != data.newSystemName:
                return {"status":'error', "detail":"a device with the same name already exists."}
        dev = Devices.get(data.systemName)
        dev.name = data.name
        dev.information = data.information
        dev.type = data.type
        if data.address:
            dev.address = data.address
        if data.valueType:
            dev.valueType = data.valueType
        if data.token:
            dev.token = data.token
        dev.typeConnect = data.typeConnect
        dev.control = ""
        dev.save()

        if(data.config):
            dev.values = []
            conf = data.config
            for item in conf:
                val = dev.addField(name=item.name)
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
                if item.unit:
                    val.unit=item.unit
                if item.control:
                    val.control=item.control
                if item.type:
                    val.type=item.type
            dev.save()
        if(data.newSystemName):
            dev.editSysemName(data.newSystemName)
        devicesArrey.delete(data.systemName)
        return {"status":'ok'}
    except Exception as e:
        logger.error(f"error edit device. detail:{e}")
        return {"status":'error', "detail":e}

async def deleteDevice(systemName: str):
    try:
        dev = Devices.get(systemName=systemName)
        devicesArrey.delete(systemName)
        dev.delete()
        deleteDeviceinpage(systemName)
        logger.info(f'delete device, systemName:{systemName}')
        return {"status":'ok'}
    except Exception as e:
        logger.error(f'error delete device, detail:{e}')
        return {"status":'error', "detail":e}

async def editStatusDevice(systemName: str, status: bool):
    try:
        dev = Devices.get(systemName=systemName)
        if(not dev):
            return {"status":'error', "detail":"device not found"}
        dev.status = status
        dev.save()
        logger.info(f'edit status device, systemName:{systemName}')
        return {"status":'ok'}
    except Exception as e:
        logger.error(f'error edit status device, detail:{e}')
        return {"status":'error', "detail":e}
