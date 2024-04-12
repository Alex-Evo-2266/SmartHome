from typing import List, TypeVar
from app.ingternal.device.CRUD.read import get_device
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.set_value import set_value
from app.ingternal.commands.exception.incorrect_command import IncorrectCommand
from app.ingternal.device.enums import TypeDeviceField, StatusDevice
import logging

DEVICE_ROOT_COMMANDS = []
DEVICE_INSTANCE_COMMANDS = []
DEVICE_FIELD_COMMANDS = []
DEVICE_FIELD_ATRIBUTE = []

logger = logging.getLogger(__name__)

T = TypeVar("T")

def look_for_param(arr:List[T], name:str)->T|None:
	for item in arr:
		if(item.name == name):
			return(item)
	return None

def get_name_method(method: str)->str:
	index = method.find("(")
	if index == -1:
		return method
	return method[0:index]

def get_device_field_data(device: DeviceSchema, name_field: str):
	if device.device_status == StatusDevice.OFFLINE or device.device_status == StatusDevice.NOT_SUPPORTED or device.device_status == StatusDevice.UNLINK:
		return "0"
	field = look_for_param(device.fields, name_field)
	if field:
		if field.type == TypeDeviceField.BINARY:
			if device.value[name_field] == field.low:
				return "0"
			elif device.value[name_field] == field.high:
				return "1"
		return device.value[name_field]
	return "0"

async def device_command(command: List[str]):
	if(command[0].find("(") and get_name_method(command[0]) in DEVICE_ROOT_COMMANDS):
		return None
	device:DeviceSchema = await get_device(command[0])
	if len(command) == 1:
		return ", ".join(x.name for x in device.fields)
	if len(command) == 2:
		return get_device_field_data(device, command[1])
	
async def set_device_value(command: List[str], value:str):
	if(len(command) == 2):
		set_value(command[0], command[1], value)
		return 1
	else:
		raise IncorrectCommand()