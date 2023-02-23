

from typing import List
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses
from SmartHome.logic.deviceClass.DeviceMeta import DefConfig
from SmartHome.logic.deviceFile.DeviceFile import DevicesFile
from SmartHome.logic.deviceFile.schema import AddDeviceSchema, DeviceFieldSchema, DeviceSchema, EditDeviceSchema
from exceptions.exceptions import DeviceNotFound

def add_device(data:AddDeviceSchema):
	print(data)
	device_schema = DeviceSchema(**(data.dict()))
	DevicesFile.create(device_schema)

