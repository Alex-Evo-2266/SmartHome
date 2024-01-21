from typing import List, Union
from app.ingternal.scripts.schemas.trigger_array_condition import ArrayItemTriggerCondition
from app.ingternal.scripts.enums import Sign, TypeEntityCondition
from app.ingternal.scripts.models.triggers import Trigger_condition
from app.ingternal.scripts.utils.trigger import remove_options, get_type_condition, is_time, get_time, trigger_entity_time_day_of_week, get_month
from app.ingternal.device.CRUD import get_field_row
from app.ingternal.device.enums import TypeDeviceField
import logging

logger = logging.getLogger(__name__)

async def _convert_trigger_condition_device(system_name:str, field:str, sign: Sign, value: str)->ArrayItemTriggerCondition | None:
	try:
		field = await get_field_row(system_name, field)
		if (field.type == TypeDeviceField.TEXT or field.type == TypeDeviceField.BINARY or field.type == TypeDeviceField.ENUM) and sign != Sign.EQUALLY:
			return None
		return ArrayItemTriggerCondition(type_entity=TypeEntityCondition.DEVICE, entity_system_name=system_name, entity_field_name=field.name, sign=sign, value=value)
	except Exception as e:
		logger.error(f"convert_trigger_condition_device error : {e}")

async def convert_trigger_condition_device(entity: str, sign: Sign, value: str)->ArrayItemTriggerCondition | None:
	data = entity.split('.')
	if len(data) >= 2:
		if remove_options(data[0]) == TypeEntityCondition.DEVICE and len(data) >= 3:
			return await _convert_trigger_condition_device(data[1], data[2], sign, value)
		elif not get_type_condition(data[0]):
			return await _convert_trigger_condition_device(data[0], data[1], sign, value)
	return None

def convert_trigger_condition_time(entity: str, sign: Sign, value: str)->ArrayItemTriggerCondition | None:
	if entity == TypeEntityCondition.TIME and sign == Sign.EQUALLY and is_time(value):
		time = get_time(value)
		return ArrayItemTriggerCondition(type_entity=TypeEntityCondition.TIME, hour=time[0], minute=time[1])
   
def convert_trigger_condition_date(entity: str, sign: Sign, value: str)->ArrayItemTriggerCondition | None:
	if entity == TypeEntityCondition.DATE and sign == Sign.EQUALLY:
		month = get_month(value)
		if month:
			return ArrayItemTriggerCondition(type_entity=TypeEntityCondition.DATE, day=None, month=month)
		day = trigger_entity_time_day_of_week(value)
		if day:
			return ArrayItemTriggerCondition(type_entity=TypeEntityCondition.DATE, day=day, month=None)
		try:
			if int(value) >= 1 and int(value) <= 31:
				return ArrayItemTriggerCondition(type_entity=TypeEntityCondition.DATE, day=value, month=None)
			return None
		except Exception as e:
			return None
	   

async def convert_trigger_condition(entity: Trigger_condition)->Union[ArrayItemTriggerCondition, None]:
	entity_conver = None
	if entity.type_entity == TypeEntityCondition.DEVICE:
		entity_conver = await convert_trigger_condition_device(entity.entity, entity.sign, entity.value)
	elif entity.type_entity == TypeEntityCondition.TIME:
		entity_conver = convert_trigger_condition_time(entity.entity, entity.sign, entity.value)
	elif entity.type_entity == TypeEntityCondition.DATE:
		entity_conver = convert_trigger_condition_date(entity.entity, entity.sign, entity.value)
	print("sdfghj", entity_conver)
	return entity_conver