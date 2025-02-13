from app.ingternal.automation.arrays.automation import AutomationManager
from app.ingternal.automation.run.automation import automation
from app.ingternal.automation.serialize_model.get_model import get_all_automation

from app.configuration.loop.loop import loop

automation_manager = AutomationManager(automation)

async def register_automation():
    automation_manager.clear_automations()
    automations = await get_all_automation()
    for automation_item in automations:
        automation_manager.add_automation(automation_item)
    
