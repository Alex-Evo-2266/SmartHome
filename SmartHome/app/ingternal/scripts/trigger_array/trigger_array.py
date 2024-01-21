from typing import List, Dict, Set
from app.ingternal.scripts.schemas.trigger_array import TriggerArrayItem, TriggerTimeItem, ArrayItemTriggerEntity
from app.ingternal.scripts.enums import TypeEntity, Periods, TIME_DAYS
from datetime import datetime, time, date
from app.ingternal.scripts.utils.trigger import get_index_weekday, get_index_month

class TriggerArray():
	device: Set[str] = set()
	time: List[TriggerTimeItem] = list()
	service: Set[str] = set()

	triggers: Dict[str, TriggerArrayItem] = {}

	@staticmethod
	def __time_entity_pars(trigger:TriggerArrayItem)->TriggerTimeItem:
		entity_data: List[ArrayItemTriggerEntity] = []
		for entity in trigger.entities:
			if entity.type_entity == TypeEntity.TIME:
				entity_data.append(entity)
		return TriggerTimeItem(entity=entity_data, trigger_name=trigger.system_name)
	
	@classmethod
	def get(cls, system_name):
		if system_name in cls.triggers:
			return cls.triggers[system_name]
		return None
	
	@classmethod
	def remove(cls, system_name):
		if system_name in cls.device:
			cls.device.remove(system_name)
		if system_name in cls.service:
			cls.service.remove(system_name)
		for item in cls.time:
			if item.trigger_name == system_name:
				cls.time.remove(item)
		cls.triggers.pop(system_name, None)
		

	@classmethod
	def add(cls, trigger: TriggerArrayItem, types: List[TypeEntity]):
		if cls.get(trigger.system_name):
			cls.remove(trigger.system_name)
		cls.triggers[trigger.system_name] = trigger
		for type in types:
			if type == TypeEntity.DEVICE:
				cls.device.add(trigger.system_name)
			elif type == TypeEntity.TIME:
				cls.time.append(TriggerArray.__time_entity_pars(trigger))
			else:
				cls.service.add(trigger.system_name)

	@classmethod
	def get_device_trigger(cls, system_name:str, field: str):
		for key in cls.device:
			for entity in cls.triggers[key].entities:
				if (entity.type_entity == TypeEntity.DEVICE and entity.entity_system_name == system_name and entity.entity_field_name == field):
					return cls.triggers[key]
		return None
	
	@classmethod
	def get_time_trigger(cls):
		time = datetime.now().time()
		date = datetime.now().date()
		triggers: List[TriggerArrayItem] = []
		for item in cls.time:
			for entity in item.entity:
				if ((entity.period == Periods.EVERY_DAY and not entity.day and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour)) or
				(entity.period == Periods.EVERY_DAY and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour) and get_index_weekday(entity.day) == date.weekday()) or
				(entity.period == Periods.EVERY_HOUR and int(time.minute) == int(entity.minute)) or
				(entity.period == Periods.EVERY_MONTH and str(entity.day) == str(date.day) and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour)) or
				(entity.period == Periods.EVERY_YEAR and str(entity.day) == str(date.day) and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour) and get_index_month(entity.month) == date.month)):
					triggers.append(cls.triggers[item.trigger_name])
					break
		return triggers
			
	@classmethod
	def all(cls):
		return cls.triggers