from app.ingternal.automation.models.automation import Automation, Automation_action, Automation_condition, Automation_trigger, Automation_action_else
from app.ingternal.automation.schemas.automation import AddAutomation, AutomationSchema, AutomationAction, AutomationCondition, AutomationTrigger
from app.ingternal.automation.exception.automation import ScriptsNotFound
from app.ingternal.automation.automation_array.automation_array_init import init_automation
from typing import List

async def create_automation(data: AddAutomation):
	automation = await Automation.objects.create(name=data.name, condition=data.condition, system_name=data.system_name)
	for action in data.actions:
		await Automation_action.objects.create(**(action.dict()), automation=automation)
	for condition in data.conditions:
		await Automation_condition.objects.create(**(condition.dict()), automation=automation)
	for entity in data.triggers:
		await Automation_trigger.objects.create(**(entity.dict()), automation=automation)
	for entity in data.differently:
		await Automation_action_else.objects.create(**(entity.dict()), automation=automation)

async def get_automation_data(automation: Automation)->AutomationSchema:
	triggers = await Automation_trigger.objects.all(automation=automation)
	conditions = await Automation_condition.objects.all(automation=automation)
	actions = await Automation_action.objects.all(automation=automation)
	differently = await Automation_action_else.objects.all(automation=automation)
	triggers_data = [AutomationTrigger(**(item.dict())) for item in triggers]
	conditions_data = [AutomationCondition(**(item.dict())) for item in conditions]
	actions_data = [AutomationAction(**(item.dict())) for item in actions]
	differently_actions_data = [AutomationAction(**(item.dict())) for item in differently]
	automation_data: AutomationSchema = AutomationSchema(
		name=automation.name,
		system_name=automation.system_name,
		condition=automation.condition,
		status=automation.status,
		triggers=triggers_data, 
		conditions=conditions_data, 
		actions=actions_data,
		differently=differently_actions_data
	)
	return automation_data

async def get_automation(system_name: str, get_or_none:bool = False):
	automation: Automation = await Automation.objects.get_or_none(system_name=system_name)
	if not automation:
		if get_or_none:
			return None
		raise ScriptsNotFound()
	return await get_automation_data(automation)

async def get_automations()->List[AutomationSchema]:
	automations: List[Automation] = await Automation.objects.all()
	automations_data: List[AutomationSchema] = [await get_automation_data(automation) for automation in automations]
	return automations_data

async def delete_automation(system_name: str):
	automation = await Automation.objects.get_or_none(system_name=system_name)
	if not automation:
		raise ScriptsNotFound()
	await automation.delete()

async def update_automation(system_name: str, data: AutomationSchema, updata_or_create: bool):
	automation:Automation = await Automation.objects.get_or_none(system_name=system_name)
	if not automation:
		if updata_or_create:
			await create_automation(AddAutomation(**(data.dict())))
		else:
			raise ScriptsNotFound()
	await Automation_action.objects.delete(automation=automation)
	await Automation_action_else.objects.delete(automation=automation)
	await Automation_condition.objects.delete(automation=automation)
	await Automation_trigger.objects.delete(automation=automation)
	for action in data.actions:
		action.id = None
		await Automation_action.objects.create(**(action.dict()), automation=automation)
	for differently in data.differently:
		differently.id = None
		await Automation_action_else.objects.create(**(differently.dict()), automation=automation)
	for condition in data.conditions:
		condition.id = None
		await Automation_condition.objects.create(**(condition.dict()), automation=automation)
	for triggers in data.triggers:
		triggers.id = None
		await Automation_trigger.objects.create(**(triggers.dict()), automation=automation)
	automation.name = data.name
	automation.system_name = data.system_name
	automation.condition = data.condition
	automation.status = data.status
	await automation.update(_columns=["name", "condition", "status", "system_name"])
	await init_automation(automation)

async def edit_status_automation(system_name: str, status: bool):
	automation:Automation = await Automation.objects.get_or_none(system_name=system_name)
	if not automation:
		raise ScriptsNotFound()
	automation.status = status
	await automation.update(_columns=["status"])
	await init_automation(automation)
