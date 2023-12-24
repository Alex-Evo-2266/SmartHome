from app.ingternal.scripts.models.triggers import Trigger, Trigger_action, Trigger_condition, Trigger_entity
from app.ingternal.scripts.schemas.trigger import AddTrigger, TriggerSchema, TriggerAction, TriggerCondition, TriggerEntity
from app.ingternal.scripts.exception.scripts import ScriptsNotFound
from typing import List

async def create_trigger(data: AddTrigger):
	trigger = await Trigger.objects.create(name=data.name, condition=data.condition)
	for action in data.actions:
		await Trigger_action.objects.create(**(action.dict()), trigger=trigger)
	for condition in data.conditions:
		await Trigger_condition.objects.create(**(condition.dict()), trigger=trigger)
	for entity in data.entities:
		await Trigger_entity.objects.create(**(entity.dict()), trigger=trigger)

async def get_trigger_data(trigger: Trigger)->TriggerSchema:
	entities = await Trigger_entity.objects.all(trigger=trigger)
	conditions = await Trigger_condition.objects.all(trigger=trigger)
	actions = await Trigger_action.objects.all(trigger=trigger)
	entities_data = [TriggerEntity(**(item.dict())) for item in entities]
	conditions_data = [TriggerCondition(**(item.dict())) for item in conditions]
	actions_data = [TriggerAction(**(item.dict())) for item in actions]
	trigger_data: TriggerSchema = TriggerSchema(
		name=trigger.name,
		condition=trigger.condition,
		status=trigger.status,
		entities=entities_data, 
		conditions=conditions_data, 
		actions=actions_data
	)
	return trigger_data

async def get_trigger(name: str):
	trigger: Trigger = await Trigger.objects.get_or_none(name=name)
	if not trigger:
		raise ScriptsNotFound()
	return get_trigger_data(trigger)

async def get_triggers()->List[TriggerSchema]:
	triggers: List[Trigger] = await Trigger.objects.all()
	triggers_data: List[TriggerSchema] = [await get_trigger_data(trigger) for trigger in triggers]
	return triggers_data

async def delete_trigger(name: str):
	trigger = await Trigger.objects.get_or_none(name=name)
	if not trigger:
		raise ScriptsNotFound()
	await trigger.delete()

async def update_trigger(name: str, data: TriggerSchema):
	trigger = await Trigger.objects.get_or_none(name=name)
	if not trigger:
		raise ScriptsNotFound()
	await Trigger_action.objects.delete(trigger=trigger)
	await Trigger_condition.objects.delete(trigger=trigger)
	await Trigger_entity.objects.delete(trigger=trigger)
	for action in data.actions:
		action.id = None
		await Trigger_action.objects.create(**(action.dict()), trigger=trigger)
	for condition in data.conditions:
		condition.id = None
		await Trigger_condition.objects.create(**(condition.dict()), trigger=trigger)
	for entity in data.entities:
		entity.id = None
		await Trigger_entity.objects.create(**(entity.dict()), trigger=trigger)
	trigger.name = data.name
	trigger.condition = data.condition
	trigger.status = data.status
	await trigger.update(_columns=["name", "condition", "status"])

async def edit_status_trigger(name: str, status: bool):
	trigger = await Trigger.objects.get_or_none(name=name)
	if not trigger:
		raise ScriptsNotFound()
	trigger.status = status
	await trigger.update(_columns=["status"])