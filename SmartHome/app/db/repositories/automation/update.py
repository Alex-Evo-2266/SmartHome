from app.schemas.automation.automation import AutomationSchema
from app.db.models.automation.automation import Automation, TargetItem, ConditionItem, ActionItem, ActionElseItem
from app.exceptions.automation import AutomationNotFound

from app.db.repositories.automation.get_model import serialize_automation

from app.core.entities.automation.register import register_automation

async def update_automation(name:str, data:AutomationSchema):
	automation = await Automation.objects.get_or_none(name=name)
	if not automation:
		raise AutomationNotFound()
	
	await automation.triggers.clear(keep_reversed=False)
	await automation.conditions.clear(keep_reversed=False)
	await automation.actions.clear(keep_reversed=False)
	await automation.else_branch.clear(keep_reversed=False)
	
	for trigger_schema in data.trigger:
		await TargetItem.objects.create(
			service=trigger_schema.service, 
			trigger=trigger_schema.trigger, 
			option=trigger_schema.option,
			automation=automation
			)

	for condition_schema in data.condition:
		await ConditionItem.objects.create(
			operation=condition_schema.operation, 
			arg1_service=condition_schema.arg1_service, 
			arg1=condition_schema.arg1, 
			arg2_service=condition_schema.arg2_service, 
			arg2=condition_schema.arg2, 
			automation=automation
			)
		
	for index, action_schema in enumerate(data.then):
		await ActionItem.objects.create(
			service=action_schema.service, 
			action=action_schema.action,
			data=action_schema.data, 
			index=index,
			type_set=action_schema.type_set,
			automation=automation
			)
		
	for index, action_schema in enumerate(data.else_branch):
		await ActionElseItem.objects.create(
			service=action_schema.service, 
			field=action_schema.action, 
			data=action_schema.data, 
			index=index,
			type_set=action_schema.type_set,
			automation=automation
			)
	automation.name = data.name
	automation.condition_type = data.condition_type
	automation.is_enabled = data.is_enabled
	await automation.update(_columns=["name", "condition_type", "is_enabled"])

	await register_automation()




async def update_status(name:str, is_enabled:bool):
	automation = await Automation.objects.get_or_none(name=name)
	if not automation:
		raise AutomationNotFound()
	
	await automation.update(is_enabled=is_enabled)

	await register_automation()

	

	