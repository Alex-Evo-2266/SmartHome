from SmartHome.schemas.script import ScriptSchema, BlockSchema, TypeBlock, TypeObject, Value, TypeValue
from SmartHome.logic.deviceFile.DeviceFile import DeviceData, DevicesFile
from SmartHome.logic.device.devices_arrey import DevicesArrey
from SmartHome.logic.script.get_script import get_script, get_script_all
from SmartHome.logic.device.set_value import set_value
from SmartHome.logic.deviceClass.DeviceGetInterface import IGetDeviceData
from SmartHome.logic.deviceClass.DeviceValueInterface import IValueDevice
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from typing import Optional, List, Dict, Any
import threading
import asyncio
import logging

logger = logging.getLogger(__name__)

def run_by_trigger_scripts(system_name: str, field_name: str):
	scripts = get_script_all()
	for item in scripts:
		for item2 in item.trigger.trigger:
			if item2.arg1 == system_name and item2.arg2 == field_name:
				run_script(item)
				break


def run_script(script: ScriptSchema):
	def r_script():
		for id in script.trigger.next:
			asyncio.run(run_block(script, id))
	try:
		s = threading.Thread(target=r_script)
		s.daemon = True
		s.start()
	except Exception as e:
		logger.error(f'error run script:{e}.')


async def get_block(script: ScriptSchema, id: int)->BlockSchema | None:
	for item in script.blocks:
		if item.id == id:
			return item
	return None

async def run_block(script: ScriptSchema, id: int):
	block = await get_block(script, id)
	if not block:
		return
	if block.type == TypeBlock.CNODITION:
		if await condition(block):
			next = block.next.get("base")
		else:
			next = block.next.get("else")
		if not next:
			return
		for id_block in next:
			await run_block(script, id_block)
	if block.type == TypeBlock.ACTION:
		await action(block)

async def condition(block: BlockSchema):
	if block.type_object == TypeObject.DEVICE:
		return await condition_device(block)
	return False

async def get_value_device(system_name: str, field_name: str)->str | None:
	device = DevicesArrey.get(system_name)
	if not device:
		return None
	device: IGetDeviceData = device.device
	if not device:
		return None
	device_data = device.get_info()
	if not device_data:
		return None
	values = device_data.value
	if not values:
		return None
	return values.get(field_name)

async def get_value_block(value: Value):
	if value.type == TypeValue.TEXT and isinstance(value.arg1, str):
		return value.arg1
	if value.type == TypeValue.NUMBER and isinstance(value.arg1, str):
		return value.arg1
	if value.type == TypeValue.DEVICE and isinstance(value.arg1, str) and isinstance(value.arg2, str):
		return await get_value_device(value.arg1, value.arg2)
	if value.type == TypeValue.DEVICE:
		return None
	if value.type == TypeValue.SELECT and isinstance(value.arg1, str):
		return value.arg1
	if value.type == TypeValue.ROUND and isinstance(value.arg1, Any) and isinstance(value.arg2, str):
		val = await get_value_block(Value(**value.arg1))
		if not val:
			return None
		val = float(val)
		val = str(round(val, int(value.arg2)))
		return val
	if value.type == TypeValue.MATH and isinstance(value.arg1, Any) and isinstance(value.arg2, Any):
		v1 = await get_value_block(Value(**value.arg1))
		v2 = await get_value_block(Value(**value.arg2))
		if not v1 or not v2:
			return None
		v = None
		if value.operator == "+":
			v = float(v1) + float(v2)
		if value.operator == "-":
			v = float(v1) - float(v2)
		if value.operator == "*":
			v = float(v1) * float(v2)
		if value.operator == "/":
			v = float(v1) / float(v2)
		return str(v)
	logger.error(f'error type value:{value}.')
	return None

async def condition_device(block: BlockSchema)->bool:
	value = await get_value_device(block.arg1, block.arg2)
	v = await get_value_block(block.value)
	if not value or not v:
		return False
	try:
		if block.operator == "==" and str(value) == str(v):
			return True
		if block.operator == "!=" and str(value) != str(v):
			return True
		if block.operator == ">" and float(value) > float(v):
			return True
		if block.operator == "<" and float(value) < float(v):
			return True
		return False
	except Exception as e:
		logger.error(f'error type value:{e}.')
		return False

def get_value(device: IValueDevice, field_name:str, value: str):
	field = device.get_field(field_name)
	if not field:
		return str()
	if field.get_type() == TypeField.BINARY:
		if value == "off" or value == "turn_off":
			return field.get_low()
		if value == "on" or value == "turn_on":
			return field.get_high()
	return str()
	

async def action_device(block: BlockSchema):
	device = DevicesArrey.get(block.arg1)
	if not device:
		return None
	device: IValueDevice = device.device
	await set_value(block.arg1, block.arg2, get_value(device, block.arg2, str(await get_value_block(block.value))))

async def action(block: BlockSchema):
	if block.type_object == TypeObject.DEVICE:
		return await action_device(block)
	return