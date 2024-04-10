from typing import List
from app.ingternal.device.CRUD.read import get_device
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.set_value import set_value
from app.ingternal.commands.exception.incorrect_command import IncorrectCommand
import logging

DEVICE_ROOT_COMMANDS = []
DEVICE_INSTANCE_COMMANDS = []
DEVICE_FIELD_COMMANDS = []
DEVICE_FIELD_ATRIBUTE = []

logger = logging.getLogger(__name__)

def get_name_method(method: str)->str:
	index = method.find("(")
	if index == -1:
		return method
	return method[0:index]

async def device_command(command: List[str]):
	if(command[0].find("(") and get_name_method(command[0]) in DEVICE_ROOT_COMMANDS):
		return None
	device:DeviceSchema = await get_device(command[0])
	if len(command) == 1:
		return ", ".join(x.name for x in device.fields)
	if len(command) == 2:
		return device.value[command[1]]
	
async def set_device_value(command: List[str], value:str):
	if(len(command) == 2):
		set_value(command[0], command[1], value)
		return 1
	else:
		raise IncorrectCommand()