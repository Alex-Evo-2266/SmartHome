
import logging
from app.pkg.runtime.loop import loop
from app.bootstrap.const import LOOP_AUTOMATION
from app.core.state.get_store import get_container

logger = logging.getLogger(__name__)

async def time_automation():
	await get_container().automation_store.run_due_automations()

async def restart_automation():
	loop.register(LOOP_AUTOMATION, time_automation, 60)