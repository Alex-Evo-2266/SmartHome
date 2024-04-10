from typing import List, Union
from datetime import datetime
from threading import Thread
import asyncio, time
from app.ingternal.automation.automation_array.automation_array import AutomationArray
from app.ingternal.automation.enums import TypeEntityCondition, Sign, Condition, TypeEntityAction, TypeValueAction
from app.ingternal.automation.schemas.automation_array import AutomationArrayItem, ArrayItemAutomationCondition, ArrayItemAutomationAction
from app.ingternal.automation.utils.automation import get_index_weekday
from app.ingternal.device.device_data.devices_arrey import DevicesArrey
from app.ingternal.device.interfaces.device_interface import IDevice
from app.ingternal.device.enums import TypeDeviceField
from app.ingternal.scripts.runing.run import run_script

def get_value(value: str):
	value = value.strip()
	if value.find(".") == -1 and value.find(" ") == -1:
		return value
	data = value.split(' ')
	if len(data) == 1:
		value_items = data[0].split('.')
		if value_items[0] == TypeValueAction.DEVICE:
			if len(value_items) >=3:
				device = DevicesArrey.get(value_items[1])
				if not device:
					return None
				device:IDevice = device.device
				field = device.get_field(value_items[2])
				if not field:
					return None
				value = field.get()
				return value
		elif value_items[0] == TypeValueAction.SERVICE:
			pass
	else:
		pass	

def condition_automation(condition: ArrayItemAutomationCondition):
	time = datetime.now().time()
	date = datetime.now().date()
	print("p1", condition)
	if condition.type_entity == TypeEntityCondition.DATE:
		if get_index_weekday(condition.day) == date.weekday() or str(condition.day) == str(date.day):
			return True
		return False
	if condition.type_entity == TypeEntityCondition.TIME:
		if int(time.minute) == int(condition.minute) and int(time.hour) == int(condition.hour):
			return True
		return False
	if condition.type_entity == TypeEntityCondition.DEVICE:
		device = DevicesArrey.get(condition.entity_system_name)
		if not device:
			return False
		device:IDevice = device.device
		field = device.get_field(condition.entity_field_name)
		if field.get_type() == TypeDeviceField.COUNTER or field.get_type() == TypeDeviceField.NUMBER:
			if condition.sign == Sign.LESS and int(field.get()) < int(condition.value):
				return True
			if condition.sign == Sign.MORE and int(field.get()) > int(condition.value):
				return True
			if condition.sign == Sign.EQUALLY and int(field.get()) == int(condition.value):
				return True
			return False
		if field.get_type() == TypeDeviceField.BINARY:
			if str(condition.value).lower() == "on" and field.get() == field.get_high():
				return True
			if str(condition.value).lower() == "off" and field.get() == field.get_low():
				return True
			if str(condition.value).lower() == str(field.get()).lower():
				return True
			return False
		if str(field.get()) == str(condition.value):
			return True
		else:
			return False
	return False

async def automation_action(action:ArrayItemAutomationAction):
	if action.type_entity == TypeEntityAction.DELAY:
		await time.sleep(action.value)
	elif action.type_entity == TypeEntityAction.DEVICE:
		device = DevicesArrey.get(action.entity_system_name)
		if not device:
			return
		device:IDevice = device.device
		field = device.get_field(action.entity_field_name)
		if not field:
			return
		if field.get_type() == TypeDeviceField.BINARY and action.value == "toggle":
			if field.get() == field.get_high():
				device.set_value(action.entity_field_name, "off")
			else:
				device.set_value(action.entity_field_name, "on")
		else:
			device.set_value(action.entity_field_name, get_value(action.value))
	elif action.type_entity == TypeEntityAction.SCRIPTS:
		await run_script(action.value)
	elif action.type_entity == TypeEntityAction.SERVICE:
		pass


async def automation_actions(actions:List[ArrayItemAutomationAction]):
	print(actions)
	for action in actions:
		await automation_action(action)

def _automation_run(automation: AutomationArrayItem):
	conditions: List[bool] = []
	print("run automation: ", automation.system_name,automation, automation.conditions)
	for condition in automation.conditions:
		conditions.append(condition_automation(condition))
	if automation.condition == Condition.AND and not(False in conditions):
		print("script ok")
		asyncio.run(automation_actions(automation.actions))
	elif automation.condition == Condition.OR and (True in conditions):
		print("script ok")
		asyncio.run(automation_actions(automation.actions))
	else:
		print("script false")
		asyncio.run(automation_actions(automation.differently))

def automation_run(automation: AutomationArrayItem):
	if not automation.status:
		return
	thread = Thread(target=_automation_run, args=(automation,))
	thread.daemon = True
	thread.start()

def automation_device_run(system_name: str, field: str):
	automations = AutomationArray.get_device_automation(system_name, field)
	print(automations)
	for automation in automations:
		automation_run(automation)