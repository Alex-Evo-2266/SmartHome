from typing import List, Union
from app.ingternal.automation.schemas.automation_array_action import ArrayItemAutomationAction
from app.ingternal.automation.enums import Sign, TypeEntityAction
from app.ingternal.automation.models.automation import Automation_action, Automation_action_else
from app.ingternal.automation.utils.automation import remove_options, get_type_action, is_time, get_time, automation_entity_time_day_of_week, get_month
from app.ingternal.device.CRUD import get_field_row
from app.ingternal.device.enums import TypeDeviceField
import logging

logger = logging.getLogger(__name__)

async def _convert_automation_action_device(system_name:str, field:str, value: str)->ArrayItemAutomationAction | None:
	try:
		field = await get_field_row(system_name, field)
		return ArrayItemAutomationAction(type_entity=TypeEntityAction.DEVICE, entity_system_name=system_name, entity_field_name=field.name, value=value)
	except Exception as e:
		logger.error(f"convert_automation_condition_device error : {e}")

async def convert_automation_action_device(entity: str, value: str)->ArrayItemAutomationAction | None:
	data = entity.split('.')
	if len(data) >= 2:
		if remove_options(data[0]) == TypeEntityAction.DEVICE and len(data) >= 3:
			return await _convert_automation_action_device(data[1], data[2], value)
		elif not get_type_action(data[0]):
			return await _convert_automation_action_device(data[0], data[1], value)
	return None

def convert_automation_action_delay(entity:str, value: str):
	try:
		if entity == TypeEntityAction.DELAY and int(value) > 0:
			return ArrayItemAutomationAction(type_entity=TypeEntityAction.DELAY, value=value)
		return None
	except Exception:
		return None
	
def convert_automation_action_script(entity:str, value: str):
	try:
		if entity == TypeEntityAction.SCRIPT:
			pass
		return None
	except Exception:
		return None

async def convert_automation_action(entity: Automation_action | Automation_action_else)->Union[ArrayItemAutomationAction, None]:
	entity_conver = None
	if entity.type_entity == TypeEntityAction.DEVICE:
		entity_conver = await convert_automation_action_device(entity.entity, entity.value)
	elif entity.type_entity == TypeEntityAction.DELAY:
		entity_conver = convert_automation_action_delay(entity.entity, entity.value)
	elif entity.type_entity == TypeEntityAction.SCRIPT:
		entity_conver = convert_automation_action_script(entity.entity, entity.value)
	return entity_conver
