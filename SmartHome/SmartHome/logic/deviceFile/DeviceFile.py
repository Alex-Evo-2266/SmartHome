from typing import Any, Dict, List
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema, DeviceSchema
from settings import DEVICES
from SmartHome.logic.utils.file import readYMLFile, writeYMLFile
from SmartHome.logic.groups.deleteDevicefromGroups import dleteDevicesFromGroups
from SmartHome.models import DeviceHistory

import json
import ast

class DeviceAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "device already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceAlreadyExistsException, {self.message}"
		else:
			return "DeviceAlreadyExistsException"

def decodField(fields):
	arr = []
	for field in fields:
		arr.append(DeviceFieldSchema(**field))
	return arr

class DevicesFile(object):
	devices = list()

	@staticmethod
	def get_devices()->List[Any]:
		return DevicesFile.devices

	@staticmethod
	def set_devices(devices):
		DevicesFile.devices = devices

	@staticmethod
	def load()->None:
		DevicesFile.devices = readYMLFile(DEVICES)

	@staticmethod
	def all()->List[Any]:
		devs = list()
		if(DevicesFile.devices == None):
			return devs
		for item in DevicesFile.devices:
			item["fields"] = decodField(item["fields"])
			devs.append(DeviceData(**item))
		return devs

	@staticmethod
	def get_raw(system_name:str)->Dict[str, Any]:
		devices = DevicesFile.devices
		if devices == None:
			devices = list()
		for item in devices:
			if(item["system_name"] == system_name):
				return item
		DevicesFile.load()
		devices = DevicesFile.devices
		if devices == None:
			devices = list()
		for item in devices:
			if(item["system_name"] == system_name):
				return item
		return None

	@staticmethod
	def get_index(system_name:str)->int|None:
		devices = DevicesFile.devices
		if devices == None:
			devices = list()
		for item in devices:
			if(item["system_name"] == system_name):
				return devices.index(item)
		DevicesFile.load()
		devices = DevicesFile.devices
		if devices == None:
			devices = list()
		for item in devices:
			if(item["system_name"] == system_name):
				return devices.index(item)
		return None

	@staticmethod
	def get(system_name:str):
		device_raw = DevicesFile.get_raw(system_name)
		if not device_raw:
			return None
		device_raw["fields"] = decodField(device_raw["fields"])
		return DeviceData(**device_raw)

	@staticmethod
	def create(data: DeviceSchema):
		devices = readYMLFile(DEVICES)
		if devices == None:
			devices = list()
		for item in devices:
			if(item["system_name"] == data.system_name):
				raise DeviceAlreadyExistsException()
		device = DeviceData(**data.dict())
		device.save()
		return device


class DeviceData(DeviceSchema):

	def editSysemName(self, newSystemName:str):
		index = DevicesFile.get_index(self.system_name)
		if not index:
			raise Exception("not device")
		devices = DevicesFile.get_devices()
		device = devices[index]
		device["system_name"] = newSystemName
		devices[index] = device
		DevicesFile.set_devices(devices)
		writeYMLFile(DEVICES, devices)

	def save(self):
		index = DevicesFile.get_index(self.system_name)
		devices = DevicesFile.get_devices()
		if not devices:
			devices = list()
		if not index:
			devices.append(self.dict())
		else:
			devices[index] = self.dict()
		DevicesFile.set_devices(devices)
		writeYMLFile(DEVICES, devices)

	async def delete(self):
		index = DevicesFile.get_index(self.system_name)
		if not index:
			raise Exception("not device")
		devices = DevicesFile.get_devices()
		devices.pop(index)
		dleteDevicesFromGroups(self.system_name)
		await DeviceHistory.objects.delete(deviceName=self.system_name)
		writeYMLFile(DEVICES, devices)

	def addField(self, data: DeviceFieldSchema):
		self.fields.append(data)
		return data

	def get_value(self):
		values = self.fields
		valuesDict = dict()
		for item in values:
			valuesDict[item.name]=item.value
		return valuesDict
