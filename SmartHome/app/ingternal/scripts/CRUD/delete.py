from app.configuration.settings import SCRIPTS_DIR, SCRIPT_AUTOMATION_PREFEX
from app.ingternal.file import readYMLFile
from app.ingternal.automation.CRUD import delete_automation

import os

async def delete_script(system_name: str):
    automation_name = system_name + "." + SCRIPT_AUTOMATION_PREFEX
    await delete_automation(automation_name)
    readYMLFile(os.path.join(SCRIPTS_DIR, system_name + ".yml"))
    os.remove(os.path.join(SCRIPTS_DIR, system_name + ".yml"))
    