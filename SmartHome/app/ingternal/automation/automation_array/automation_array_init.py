from typing import List, Set
from app.ingternal.automation.models.automation import Automation
from app.ingternal.automation.automation_array.automation_array import AutomationArray
from app.ingternal.automation.serialization.serialization_automation import convert_automation
from app.ingternal.automation.enums import TypeEntityTrigger


async def init_automation(automation: Automation):
    data = await convert_automation(automation)
    if not data:
        return
    types: Set[TypeEntityTrigger] = set()
    for entity in data.entities:
        types.add(entity.type_entity)
    print("types", types)
    AutomationArray.add(data, list(types))

async def init_automations():
    automations: List[Automation] = await Automation.objects.all()
    for automation in automations:
        await init_automation(automation)
    print("array", AutomationArray.all())