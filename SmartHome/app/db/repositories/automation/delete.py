from app.db.models.automation.automation import Automation
from app.exceptions.automation import AutomationNotFound
from app.core.entities.automation.register import register_automation

async def delete_automation(name:str):
	automation = await Automation.objects.get_or_none(name=name)
	if not automation:
		raise AutomationNotFound()
	await automation.delete()
	await register_automation()
