from app.core.entities.automation.register import register_automation
from app.core.entities.automation.run_automation import restart_automation

async def start_automation():
    await register_automation()
    await restart_automation()