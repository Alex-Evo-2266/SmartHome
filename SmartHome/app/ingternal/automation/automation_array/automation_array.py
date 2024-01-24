from typing import List, Dict, Set
from app.ingternal.automation.schemas.automation_array import AutomationArrayItem, AutomationTimeItem, ArrayItemAutomationEntity
from app.ingternal.automation.enums import TypeEntityTrigger, Periods, TIME_DAYS
from datetime import datetime, time, date
from app.ingternal.automation.utils.automation import get_index_weekday, get_index_month

class AutomationArray():
	device: Set[str] = set()
	time: List[AutomationTimeItem] = list()
	service: Set[str] = set()

	automations: Dict[str, AutomationArrayItem] = {}

	@staticmethod
	def __time_entity_pars(automation:AutomationArrayItem)->AutomationTimeItem:
		entity_data: List[ArrayItemAutomationEntity] = []
		for entity in automation.entities:
			if entity.type_entity == TypeEntityTrigger.TIME:
				entity_data.append(entity)
		return AutomationTimeItem(entity=entity_data, automation_name=automation.system_name)
	
	@classmethod
	def get(cls, system_name):
		if system_name in cls.automations:
			return cls.automations[system_name]
		return None
	
	@classmethod
	def remove(cls, system_name):
		if system_name in cls.device:
			cls.device.remove(system_name)
		if system_name in cls.service:
			cls.service.remove(system_name)
		for item in cls.time:
			if item.automation_name == system_name:
				cls.time.remove(item)
		cls.automations.pop(system_name, None)
		

	@classmethod
	def add(cls, automation: AutomationArrayItem, types: List[TypeEntityTrigger]):
		if cls.get(automation.system_name):
			cls.remove(automation.system_name)
		cls.automations[automation.system_name] = automation
		for type in types:
			if type == TypeEntityTrigger.DEVICE:
				cls.device.add(automation.system_name)
			elif type == TypeEntityTrigger.TIME:
				cls.time.append(AutomationArray.__time_entity_pars(automation))
			else:
				cls.service.add(automation.system_name)

	@classmethod
	def get_device_automation(cls, system_name:str, field: str):
		automations: List[AutomationArrayItem] = []
		for key in cls.device:
			for entity in cls.automations[key].entities:
				if (entity.type_entity == TypeEntityTrigger.DEVICE and entity.entity_system_name == system_name and entity.entity_field_name == field):
					automations.append(cls.automations[key])
					break
		return automations
	
	@classmethod
	def get_time_automation(cls):
		time = datetime.now().time()
		date = datetime.now().date()
		automations: List[AutomationArrayItem] = []
		for item in cls.time:
			for entity in item.entity:
				if ((entity.period == Periods.EVERY_DAY and not entity.day and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour)) or
				(entity.period == Periods.EVERY_DAY and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour) and get_index_weekday(entity.day) == date.weekday()) or
				(entity.period == Periods.EVERY_HOUR and int(time.minute) == int(entity.minute)) or
				(entity.period == Periods.EVERY_MONTH and str(entity.day) == str(date.day) and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour)) or
				(entity.period == Periods.EVERY_YEAR and str(entity.day) == str(date.day) and int(time.minute) == int(entity.minute) and int(time.hour) == int(entity.hour) and get_index_month(entity.month) == date.month)):
					automations.append(cls.automations[item.automation_name])
					break
		return automations
			
	@classmethod
	def all(cls):
		return cls.automations