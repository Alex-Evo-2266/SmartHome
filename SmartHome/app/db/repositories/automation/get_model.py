from app.schemas.automation.automation import AutomationSchema, ActionItemSchema, TriggerItemSchema, ConditionItemSchema
from app.db.models.automation.automation import Automation, TargetItem, ConditionItem, ActionItem, ActionElseItem
from app.exceptions.automation import AutomationNotFound
from typing import List
from operator import attrgetter

#нужно везде переименовать targets на triggers чет написал не то

async def get_all_automation():
    automations = await Automation.objects.all()
    return [await serialize_automation(x) for x in automations]

async def get_automation(name:str):
    automation = await Automation.objects.get_or_none(name=name)
    if not automation:
        raise AutomationNotFound()
    return await serialize_automation(automation)

async def serialize_automation(automation:Automation):
    automation_schema = AutomationSchema(name=automation.name, condition_type=automation.condition_type, is_enabled=automation.is_enabled, trigger=[], condition=[], then=[], else_branch=[])
    triggers = [serialize_target(trigger) for trigger in await automation.triggers.all()]
    conditions = [serialize_condition(condition) for condition in await automation.conditions.all()]
    automation_schema.trigger = triggers
    automation_schema.condition = conditions
    automation_schema.then = serialize_action(await automation.actions.all())
    automation_schema.else_branch = serialize_action(await automation.else_branch.all())

    return automation_schema

def serialize_target(target: TargetItem):
    return TriggerItemSchema(
        service=target.service,
        trigger=target.trigger,
        option=target.option
    )

def serialize_condition(condition: ConditionItem):
    return ConditionItemSchema(
        operation=condition.operation, 
        arg1_service=condition.arg1_service, 
        arg1=condition.arg1, 
        arg2_service=condition.arg2_service, 
        arg2=condition.arg2, 
    )

def serialize_action(actions: List[ActionItem] | List[ActionElseItem]):
    actions.sort(key=attrgetter('index'))
    return[ActionItemSchema(
        service=action.service, 
        action=action.action,
        data=action.data, 
        type_set=action.type_set
    ) for action in actions]

async def get_trigger(trigger: TriggerItemSchema): 
    if trigger.service == "device":
        pass
    if trigger.service == "time":
        triggers = await TargetItem.objects.filter(service=trigger.service).all()