from typing import List, Union
from app.ingternal.automation.models.automation import Automation, Automation_action, Automation_action_else, Automation_condition, Automation_trigger
from app.ingternal.automation.schemas.automation_array import TypeEntityTrigger, AutomationArrayItem, ArrayItemAutomationAction, ArrayItemAutomationCondition, ArrayItemAutomationEntity
from app.ingternal.automation.serialization.serialization_automation_action import convert_automation_action
from app.ingternal.automation.serialization.serialization_automation_condition import convert_automation_condition
from app.ingternal.automation.serialization.serialization_automation_trigger import convert_automation_entity

async def convert_automation(automation: Automation):
    if automation.status == False:
        return None
    trigger_entitys:List[Automation_trigger] = await Automation_trigger.objects.all(automation=automation)
    automation_conditions:List[Automation_condition] = await Automation_condition.objects.all(automation=automation)
    automation_actions:List[Automation_action] = await Automation_action.objects.all(automation=automation)
    automation_differently:List[Automation_action_else] = await Automation_action_else.objects.all(automation=automation)
    entities: List[ArrayItemAutomationEntity] = []
    conditions: List[ArrayItemAutomationCondition] = []
    actions: List[ArrayItemAutomationAction] = []
    differently_list: List[ArrayItemAutomationAction] = []
    print("pafsedrtfj")
    for automation_entity in trigger_entitys:
        data = convert_automation_entity(automation_entity)
        if not data:
            continue
        entities.append(data)
    for automation_condition in automation_conditions:
        data_condition = await convert_automation_condition(automation_condition)
        if not data_condition:
            continue
        conditions.append(data_condition)
    for automation_action in automation_actions:
        data_action = await convert_automation_action(automation_action)
        if not data_action:
            continue
        actions.append(data_action)
    for automation_differently_item in automation_differently:
        data_action_differently = await convert_automation_action(automation_differently_item)
        if not data_action_differently:
            continue
        differently_list.append(data_action_differently)
    data_automation = AutomationArrayItem(
        name=automation.name, 
        system_name=automation.system_name, 
        condition=automation.condition, 
        status=automation.status,
        entities=entities, 
        conditions=conditions,
        actions=actions,
        differently=differently_list
        )
    return data_automation