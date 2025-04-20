from app.ingternal.automation.schemas.automation import AutomationSchema
from app.ingternal.automation.models.automation import Automation, TargetItem, ConditionItem, ActionItem, ActionElseItem
from app.ingternal.automation.exceptions.automation import AutomationNotFound

from app.ingternal.automation.serialize_model.get_model import serialize_automation

from app.ingternal.automation.run.register import automation_manager, register_automation

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
			object=trigger_schema.object, 
			data=trigger_schema.data, 
			option=trigger_schema.option,
			automation=automation
			)

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
	automation.is_enabled = data.is_enabled
	await automation.update(_columns=["name", "condition_type", "is_enabled"])

	await register_automation()

	# automation_schema = serialize_automation(automation)
	# automation_manager.remove_automation_by_name(name)
	# automation_manager.add_automation(automation_schema)
	


async def update_status(name:str, is_enabled:bool):
	automation = await Automation.objects.get_or_none(name=name)
	if not automation:
		raise AutomationNotFound()
	
	await automation.update(is_enabled=is_enabled)


	# automation_manager.remove_automation_by_name(name)
	# if is_enabled:
	# 	automation_schema = serialize_automation(automation)
	# 	automation_manager.add_automation(automation_schema)

	await register_automation()

	

	