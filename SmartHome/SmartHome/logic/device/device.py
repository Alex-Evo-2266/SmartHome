

from typing import List
from SmartHome.logic.deviceFile.DeviceFile import DevicesFile
from SmartHome.logic.deviceFile.schema import AddDeviceSchema, DeviceFieldSchema, DeviceSchema, EditDeviceSchema

def add_device(data:AddDeviceSchema):
	print(data)
	device_schema = DeviceSchema(**(data.dict()))
	DevicesFile.create(device_schema)

