from typing import List, Union
from datetime import datetime
from threading import Thread
import threading, asyncio, time
from app.ingternal.scripts.models.triggers import Trigger, Trigger_entity
from app.ingternal.scripts.enums import TypeEntityCondition, Sign, Condition, TypeEntityAction
from app.ingternal.scripts.schemas.trigger_array import TriggerArrayItem, ArrayItemTriggerCondition, ArrayItemTriggerAction
from app.ingternal.scripts.utils.trigger import get_index_weekday
from app.ingternal.device.devices_arrey import DevicesArrey
from app.ingternal.device.interfaces.device_interface import IDevice
from app.ingternal.device.enums import TypeDeviceField

async def trigger_device_run_async(system_name: str, field: str):
	triggers:List[Trigger_entity] = await Trigger_entity.objects.all()
	for trigger in triggers:
		...

def trigger_device_run(system_name: str, field: str):
	loop = asyncio.get_running_loop()
	loop.create_task(trigger_device_run_async(system_name, field))

def condition_trigger(condition: ArrayItemTriggerCondition):
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
		print("p2",field)
		if field.get_type() == TypeDeviceField.COUNTER or field.get_type() == TypeDeviceField.NUMBER:
			if condition.sign == Sign.LESS and int(field.get()) < int(condition.value):
				return True
			if condition.sign == Sign.MORE and int(field.get()) > int(condition.value):
				return True
			if condition.sign == Sign.EQUALLY and int(field.get()) == int(condition.value):
				return True
			return False
		if field.get_type() == TypeDeviceField.BINARY:
			print("p3",field.get())
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

async def trigger_action(action:ArrayItemTriggerAction):
	if action.type_entity == TypeEntityAction.DELAY:
		await time.sleep(action.value)
	elif action.type_entity == TypeEntityAction.DEVICE:
		device = DevicesArrey.get(action.entity_system_name)
		if not device:
			return
		device:IDevice = device.device
		device.set_value(action.entity_field_name, action.value)
		# field = device.get_field(action.entity_field_name)
		# if not field:
		# 	return
		# field.set()


async def trigger_actions(actions:List[ArrayItemTriggerAction]):
	print(actions)
	for action in actions:
		await trigger_action(action)

def _trigger_run(trigger: TriggerArrayItem):
	conditions: List[bool] = []
	print("run trigger: ", trigger.system_name,trigger, trigger.conditions)
	for condition in trigger.conditions:
		conditions.append(condition_trigger(condition))
	if trigger.condition == Condition.AND and not(False in conditions):
		print("script ok")
		asyncio.run(trigger_actions(trigger.actions))
	elif trigger.condition == Condition.OR and (True in conditions):
		print("script ok")
		asyncio.run(trigger_actions(trigger.actions))
	else:
		print("script false")
		asyncio.run(trigger_actions(trigger.differently))

def trigger_run(trigger: TriggerArrayItem):
	if not trigger.status:
		return
	thread = Thread(target=_trigger_run, args=(trigger,))
	thread.daemon = True
	thread.start()
