from app.schemas.automation.automation import AutomationSchema
from app.db.models.automation.automation import Automation, TargetItem, ConditionItem, ActionItem, ActionElseItem

from app.core.entities.automation.register import register_automation


async def add_automation(data:AutomationSchema):
	if data.name == '':
		raise Exception('invalid name')
	automation = await Automation.objects.create(name=data.name, condition_type=data.condition_type, is_enabled=data.is_enabled)

	

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
			action=action_schema.action, 
			data=action_schema.data, 
			index=index,
			type_set=action_schema.type_set,
			automation=automation
			)
	
	# automation_schema = serialize_automation(automation)
	# automation_manager.add_automation(automation_schema)
	await register_automation()

