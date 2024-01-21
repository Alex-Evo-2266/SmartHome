from typing import List, Union
from app.ingternal.scripts.models.triggers import Trigger, Trigger_action, Trigger_action_differently, Trigger_condition, Trigger_entity
from app.ingternal.scripts.schemas.trigger_array import TriggerArrayItem, ArrayItemTriggerEntity,ArrayItemTriggerAction,ArrayItemTriggerCondition
from app.ingternal.scripts.serialization.serialization_trigger_action import convert_trigger_action
from app.ingternal.scripts.serialization.serialization_trigger_condition import convert_trigger_condition
from app.ingternal.scripts.serialization.serialization_trigger_trigger import convert_trigger_entity

async def convert_trigger(trigger: Trigger):
    if trigger.status == False:
        return None
    trigger_entitys:List[Trigger_entity] = await Trigger_entity.objects.all(trigger=trigger)
    trigger_conditions:List[Trigger_condition] = await Trigger_condition.objects.all(trigger=trigger)
    trigger_actions:List[Trigger_action] = await Trigger_action.objects.all(trigger=trigger)
    trigger_differently:List[Trigger_action_differently] = await Trigger_action_differently.objects.all(trigger=trigger)
    entities: List[ArrayItemTriggerEntity] = []
    conditions: List[ArrayItemTriggerCondition] = []
    actions: List[ArrayItemTriggerAction] = []
    differently_list: List[ArrayItemTriggerAction] = []
    for trigger_entity in trigger_entitys:
        data = convert_trigger_entity(trigger_entity)
        if not data:
            continue
        entities.append(data)
    for trigger_condition in trigger_conditions:
        data_condition = await convert_trigger_condition(trigger_condition)
        if not data_condition:
            continue
        conditions.append(data_condition)
    for trigger_action in trigger_actions:
        data_action = await convert_trigger_action(trigger_action)
        if not data_action:
            continue
        actions.append(data_action)
    for trigger_differently_item in trigger_differently:
        data_action_differently = await convert_trigger_action(trigger_differently_item)
        if not data_action_differently:
            continue
        differently_list.append(data_action_differently)
    data_trigger = TriggerArrayItem(
        name=trigger.name, 
        system_name=trigger.system_name, 
        condition=trigger.condition, 
        status=trigger.status,
        entities=entities, 
        conditions=conditions,
        actions=actions,
        differently=differently_list
        )
    return data_trigger