from typing import List, Set
from app.ingternal.scripts.models.triggers import Trigger
from app.ingternal.scripts.trigger_array.trigger_array import TriggerArray
from app.ingternal.scripts.serialization.serialization_trigger import convert_trigger
from app.ingternal.scripts.enums import TypeEntity


async def init_trigger(trigger: Trigger):
    data = await convert_trigger(trigger)
    if not data:
        return
    types: Set[TypeEntity] = set()
    for entity in data.entities:
        types.add(entity.type_entity)
    print("types", types)
    TriggerArray.add(data, list(types))

async def init_triggers():
    triggers: List[Trigger] = await Trigger.objects.all()
    for trigger in triggers:
        await init_trigger(trigger)
    print("array", TriggerArray.all())