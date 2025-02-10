
import logging
from app.configuration.loop.loop import loop
from app.configuration.settings import LOOP_AUTOMATION
from app.ingternal.automation.run.register import automation_manager

logger = logging.getLogger(__name__)

async def time_automation():
	await automation_manager.run_due_automations()

async def restart_automation():
	loop.register(LOOP_AUTOMATION, time_automation, 60)