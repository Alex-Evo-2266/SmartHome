from .DeviceFile import Devices
from .DeviceElement import DeviceElement
from SmartHome.models import DeviceHistory
import logging
import asyncio
import threading
from datetime import datetime
from SmartHome.schemas.device import DeviceSchema, DeviceFieldSchema
from moduls_src.models_schema import AddDevice, EditDevice


logger = logging.getLogger(__name__)

def look_for_param(arr:list, val):
    for item in arr:
        if(item.name == val):
            return(item)
    return None

class BaseDevice(object):
    """docstring for BaseDevice."""

    typesDevice = ["all"]
    name = None
    addConfig = AddDevice()
    autoAddedConfig = None
    editConfig = EditDevice()

    def __init__(self, systemName:str):
        self.systemName = systemName
        deviceData = Devices.get(systemName=self.systemName)
        self.status = deviceData.status
        self.name = deviceData.name
        self.coreAddress = deviceData.address
        self.token = deviceData.token
        self.info = deviceData.information
        self.type = deviceData.type
        self.typeConnect = deviceData.typeConnect
        self.valueType = deviceData.valueType
        self.values = []
        self.device = None
        for item in deviceData.fields:
            self.values.append(DeviceElement(**item.dict(), deviceName=self.systemName))

    def get_value(self, name):
        value = look_for_param(self.values, name)
        if not value:
            return None
        return value.getDict()

    def get_field(self, name:str):
        return look_for_param(self.values, name)

    def get_values(self):
        res = []
        for item in self.values:
            res.append(item.getDict())
        return res

    def get_device(self):
        return self.device

    def set_value(self, name, status):
        value = look_for_param(self.values, name)
        if(value):
            if(value.type == "number"):
                if(int(status) > int(value.high)):
                    status = value.high
                if(int(status) < int(value.low)):
                    status = value.low
            value.set(status, False)
        return status

    # def update_value(self, *args, **kwargs):


    def save(self):
        dev = Devices.get(systemName=self.systemName)
        for item in self.values:
            value = look_for_param(dev.fields, item.name)
            if value:
                value.value = item.get()
        dev.save()
        logger.info(f'save {self.name}')

    async def save_and_addrecord(self):
        dev = Devices.get(systemName=self.systemName)
        for item in self.values:
            value = look_for_param(dev.fields, item.name)
            if value:
                value.value = item.get()
            if not value.unit:
                value.unit = ""
            if not value.value:
                value.value = "0"
            await DeviceHistory.objects.create(deviceName=self.systemName, field=item.name, type=item.type, value=value.value, unit=value.unit, datatime=datetime.now().timestamp())
        dev.save()
        logger.info(f'save history {self.name}')

    def get_Base_Info(self)->DeviceSchema:
        res = DeviceSchema(
            address=self.coreAddress,
            information=self.info,
            name=self.name,
            status=self.status,
            systemName=self.systemName,
            token=self.token,
            type=self.type,
            typeConnect=self.typeConnect,
            valueType=self.valueType,
            fields=[],
            value=None
            )
        values = []
        vals = dict()
        for item in self.values:
            values.append(item.getData())
            vals[item.name] = item.get()
        res.fields = values
        res.value = vals
        return res

    def get_All_Info(self):
        return self.get_Base_Info()
