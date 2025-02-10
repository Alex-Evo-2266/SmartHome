from app.ingternal.automation.models.automation import Automation
from app.ingternal.automation.exceptions.automation import AutomationNotFound

async def delete_automation(name:str):
    automation = await Automation.objects.get_or_none(name=name)
    if not automation:
        raise AutomationNotFound()
    await automation.delete()