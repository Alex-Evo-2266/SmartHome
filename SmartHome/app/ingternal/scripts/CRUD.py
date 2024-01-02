from app.ingternal.scripts.models.triggers import Trigger, Trigger_action, Trigger_condition, Trigger_entity, Trigger_action_differently
from app.ingternal.scripts.schemas.trigger import AddTrigger, TriggerSchema, TriggerAction, TriggerCondition, TriggerEntity
from app.ingternal.scripts.exception.scripts import ScriptsNotFound
from typing import List

async def create_trigger(data: AddTrigger):
	trigger = await Trigger.objects.create(name=data.name, condition=data.condition, system_name=data.system_name)
	for action in data.actions:
		await Trigger_action.objects.create(**(action.dict()), trigger=trigger)
	for condition in data.conditions:
		await Trigger_condition.objects.create(**(condition.dict()), trigger=trigger)
	for entity in data.entities:
		await Trigger_entity.objects.create(**(entity.dict()), trigger=trigger)
	for entity in data.differently:
		await Trigger_action_differently.objects.create(**(entity.dict()), trigger=trigger)

async def get_trigger_data(trigger: Trigger)->TriggerSchema:
	entities = await Trigger_entity.objects.all(trigger=trigger)
	conditions = await Trigger_condition.objects.all(trigger=trigger)
	actions = await Trigger_action.objects.all(trigger=trigger)
	differently = await Trigger_action_differently.objects.all(trigger=trigger)
	entities_data = [TriggerEntity(**(item.dict())) for item in entities]
	conditions_data = [TriggerCondition(**(item.dict())) for item in conditions]
	actions_data = [TriggerAction(**(item.dict())) for item in actions]
	differently_actions_data = [TriggerAction(**(item.dict())) for item in differently]
	trigger_data: TriggerSchema = TriggerSchema(
		name=trigger.name,
		system_name=trigger.system_name,
		condition=trigger.condition,
		status=trigger.status,
		entities=entities_data, 
		conditions=conditions_data, 
		actions=actions_data,
		differently=differently_actions_data
	)
	return trigger_data

async def get_trigger(system_name: str):
	trigger: Trigger = await Trigger.objects.get_or_none(system_name=system_name)
	if not trigger:
		raise ScriptsNotFound()
	return get_trigger_data(trigger)

async def get_triggers()->List[TriggerSchema]:
	triggers: List[Trigger] = await Trigger.objects.all()
	triggers_data: List[TriggerSchema] = [await get_trigger_data(trigger) for trigger in triggers]
	return triggers_data

async def delete_trigger(system_name: str):
	trigger = await Trigger.objects.get_or_none(system_name=system_name)
	if not trigger:
		raise ScriptsNotFound()
	await trigger.delete()

async def update_trigger(system_name: str, data: TriggerSchema):
	trigger = await Trigger.objects.get_or_none(system_name=system_name)
	if not trigger:
		raise ScriptsNotFound()
	await Trigger_action.objects.delete(trigger=trigger)
	await Trigger_action_differently.objects.delete(trigger=trigger)
	await Trigger_condition.objects.delete(trigger=trigger)
	await Trigger_entity.objects.delete(trigger=trigger)
	for action in data.actions:
		action.id = None
		await Trigger_action.objects.create(**(action.dict()), trigger=trigger)
	for differently in data.differently:
		differently.id = None
		await Trigger_action_differently.objects.create(**(differently.dict()), trigger=trigger)
	for condition in data.conditions:
		condition.id = None
		await Trigger_condition.objects.create(**(condition.dict()), trigger=trigger)
	for entity in data.entities:
		entity.id = None
		await Trigger_entity.objects.create(**(entity.dict()), trigger=trigger)
	trigger.name = data.name
	trigger.system_name = data.system_name
	trigger.condition = data.condition
	trigger.status = data.status
	await trigger.update(_columns=["name", "condition", "status", "system_name"])

async def edit_status_trigger(system_name: str, status: bool):
	trigger = await Trigger.objects.get_or_none(system_name=system_name)
	if not trigger:
		raise ScriptsNotFound()
	trigger.status = status
	await trigger.update(_columns=["status"])