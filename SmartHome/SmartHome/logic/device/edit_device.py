
from typing import Any, List, Type
from SmartHome.logic.device.devicesArrey import DevicesArrey
from SmartHome.logic.deviceClass.schema import ChangeField
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses

from SmartHome.logic.deviceFile.schema import DeviceFieldSchema, EditDeviceSchema
from SmartHome.logic.deviceFile.DeviceFile import DevicesFile
from exceptions.exceptions import DeviceNotFound
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice

class DeviceTypesNotMatch(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "device types do not match."
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceTypesNotMatch, {self.message}"
		else:
			return "DeviceTypesNotMatch"

class DeviceInvalidFields(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "device invalid fields"
	
	def __str__(self) -> str:
		if self.message:
			return f"DeviceInvalidFields, {self.message}"
		else:
			return "DeviceInvalidFields"

def search_field(fields:List[DeviceFieldSchema], name):
	for item in fields:
		if item.name == name:
			return item
	return None

def added_field(fields_new:List[DeviceFieldSchema], fields_old:List[DeviceFieldSchema]):
	arr:List[DeviceFieldSchema] = []
	for field_new in fields_new:
		flag = False
		for field_old in fields_old:
			if field_new.name == field_old.name:
				flag = True
		if not flag:
			arr.append(field_new)
	return arr

def deleted_field(fields_new:List[DeviceFieldSchema], fields_old:List[DeviceFieldSchema]):
	arr:List[DeviceFieldSchema] = []
	for field_old in fields_old:
		flag = False
		for field_new in fields_new:
			if field_new.name == field_old.name:
				flag = True
		if not flag:
			arr.append(field_old)
	return arr

def edit_field(field_new:DeviceFieldSchema, field_old:DeviceFieldSchema, option:ChangeField):
	if option.address:
		field_old.address = field_new.address
	if option.control:
		field_old.control = field_new.control
	if option.value:
		field_old.value = field_new.value
	if option.type:
		field_old.type = field_new.type
	if option.low:
		field_old.low = field_new.low
	if option.high:
		field_old.high = field_new.high
	if option.enum_values:
		field_old.enum_values = field_new.enum_values
	if option.icon:
		field_old.icon = field_new.icon
	if option.unit:
		field_old.unit = field_new.unit
	return field_old


def field_edit(fields_new:List[DeviceFieldSchema], fields_old:List[DeviceFieldSchema], option:ChangeField):
	arr:List[DeviceFieldSchema] = []
	for field_old in fields_old:
		for field_new in fields_new:
			if field_new.name == field_old.name:
				arr.append(edit_field(field_new, field_old, option=option))
	return arr

async def edit_device(system_name:str, data:EditDeviceSchema):
	old_device_data = DevicesFile.get(system_name)
	if not old_device_data:
		raise DeviceNotFound
	if old_device_data.class_device != data.class_device:
		raise DeviceTypesNotMatch()
	device_class:BaseDevice = DeviceClasses.get(data.class_device)
	option = device_class.Config
	added_fields = added_field(data.fields, old_device_data.fields)
	deleted_fields = deleted_field(data.fields, old_device_data.fields)
	if not option.fields_change.added and len(added_fields != 0):
		raise DeviceInvalidFields()
	if not option.fields_change.deleted and len(deleted_fields != 0):
		raise DeviceInvalidFields()
	if not option.address and old_device_data.address != data.address:
		raise DeviceInvalidFields("not change address")
	if not option.token and old_device_data.token != data.token:
		raise DeviceInvalidFields("not change token")
	old_device_data.address = data.address
	old_device_data.name = data.name
	old_device_data.system_name = data.system_name
	old_device_data.fields = field_edit(data.fields, old_device_data.fields, option.fields_change)
	print(old_device_data)
	old_device_data.save()
	DevicesArrey.delete(system_name)

async def delete_device(system_name: str):
	print("p0")
	old_device_data = DevicesFile.get(system_name)
	print("p1", old_device_data)
	if not old_device_data:
		raise DeviceNotFound
	print("p2")
	await old_device_data.delete()
	DevicesArrey.delete(system_name)