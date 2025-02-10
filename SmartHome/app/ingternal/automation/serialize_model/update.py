from app.ingternal.automation.schemas.automation import AutomationSchema, ActionItemSchema, TriggerItemSchema, ConditionItemSchema
from app.ingternal.automation.models.automation import Automation, TargetItem, ConditionItem, ActionItem, ActionElseItem
from app.ingternal.automation.exceptions.automation import AutomationNotFound
from typing import List
from operator import attrgetter

async def update_automation(name:str, data:AutomationSchema):
	automation = await Automation.objects.get_or_none(name=name)
	if not automation:
		raise AutomationNotFound()
	
	print("[p9]")
	await automation.targets.clear(keep_reversed=False)
	await automation.conditions.clear(keep_reversed=False)
	await automation.actions.clear(keep_reversed=False)
	await automation.else_branch.clear(keep_reversed=False)
	print("[p9]")
	


	print("[p9]")
	
	for trigger_schema in data.trigger:
		await TargetItem.objects.create(
			service=trigger_schema.service, 
			object=trigger_schema.object, 
			data=trigger_schema.data, 
			automation=automation
			)
	print("[p9]")

	for condition_schema in data.condition:
		await ConditionItem.objects.create(
			operation=condition_schema.operation, 
			arg1_service=condition_schema.arg1_service, 
			arg1_object=condition_schema.arg1_object, 
			arg1_data=condition_schema.arg1_data, 
			arg2_service=condition_schema.arg2_service, 
			arg2_object=condition_schema.arg2_object, 
			arg2_data=condition_schema.arg2_data, 
			automation=automation
			)
		
	for index, action_schema in enumerate(data.then):
		await ActionItem.objects.create(
			service=action_schema.service, 
			object=action_schema.object, 
			field=action_schema.field,
			data=action_schema.data, 
			index=index,
			type_set=action_schema.type_set,
			automation=automation
			)
		
	for index, action_schema in enumerate(data.else_branch):
		await ActionElseItem.objects.create(
			service=action_schema.service, 
			object=action_schema.object, 
			field=action_schema.field,
			data=action_schema.data, 
			index=index,
			type_set=action_schema.type_set,
			automation=automation
			)
	automation.name = data.name
	automation.condition_type = data.condition_type
	await automation.update(_columns=["name", "condition_type"])