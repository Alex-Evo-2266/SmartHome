from app.ingternal.automation.schemas.automation import AutomationSchema, ConditionItemSchema, ActionItemSchema
from app.ingternal.automation.schemas.enums import ConditionType, Operation
from app.ingternal.device.schemas.enums import TypeDeviceField
from typing import Optional

from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.exceptions.device import DeviceNotFound, DeviceNotValueFound, DeviceFieldNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.interface.device_class import IDevice

async def condition_data(service: str, object:str, data:str):
	if(service == 'device'):
		dev:DeviceRegistry = servicesDataPoll.get('poll-device-data')
		device: Optional[DeviceSchema] = dev.get(object)
		if not device:
			raise DeviceNotFound()
		value = device.value.get(data, None)
		print("p99", value, device, device.value)
		if not value:
			raise DeviceNotValueFound()
		return value
	elif(service == 'value'):
		return data
	elif(service == 'time'):
		pass
	else:
		return None



async def condition(condition: ConditionItemSchema)->bool:
	condition_item1 = await condition_data(condition.arg1_service, condition.arg1_object, condition.arg1_data)
	condition_item2 = await condition_data(condition.arg2_service, condition.arg2_object, condition.arg2_data)
	print("p89", condition_item1, condition_item2)
	if condition.operation == Operation.EQUAL:
		if condition_item1 == condition_item2:
			return True
	elif condition.operation == Operation.NOT_EQUAL:
		if condition_item1 != condition_item2:
			return True
	elif condition.operation == Operation.MORE:
		if int(condition_item1) > int(condition_item2):
			return True
	elif condition.operation == Operation.MORE_OR_EQUAL:
		if int(condition_item1) >= int(condition_item2):
			return True
	elif condition.operation == Operation.LESS:
		if int(condition_item1) < int(condition_item2):
			return True
	elif condition.operation == Operation.LESS_OR_EQUAL:
		if int(condition_item1) <= int(condition_item2):
			return True
	return False

async def action(data:ActionItemSchema):
	if data.service == "device":
		device = DevicesArray.get(data.object)
		if not device:
			raise DeviceNotFound()
		device_control:IDevice = device.device
		field = device_control.get_field_by_name(data.field)
		if not field:
			raise DeviceFieldNotFound()
		if field.get_type() == TypeDeviceField.BINARY and data.data == "target":
			print(field)
			value = field.get()
			if (field.get_low() == "" and value == "0"):
				device_control.set_value(field.get_id(), "1", script=True)
			elif (field.get_low() == value):
				device_control.set_value(field.get_id(), field.get_high(), script=True)
			elif (field.get_high() == "" and value == "1"):
				device_control.set_value(field.get_id(), "0", script=True)
			elif (field.get_high() == value):
				device_control.set_value(field.get_id(), field.get_low(), script=True)
		else:
			device_control.set_value(field.get_id(), data.data, script=True)
	elif data.service == "script":
		pass


async def automation(data:AutomationSchema):
	conditions = [await condition(condition_schema) for condition_schema in data.condition]
	if (data.condition_type == ConditionType.AND and all(conditions)) or (data.condition_type == ConditionType.OR and any(conditions)):
		for action_item in data.then:
			await action(action_item)
	else:
		for action_item in data.else_branch:
			await action(action_item)