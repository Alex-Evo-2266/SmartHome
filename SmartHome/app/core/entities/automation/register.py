# from app.core.entities.automation.automation import automation
from app.db.repositories.automation.get_model import get_all_automation
from app.core.state.get_store import get_container
from app.pkg.logger import MyLogger

logger = MyLogger().get_logger(__name__)

# automation_manager = AutomationManager(automation)

async def register_automation():
    logger.debug("register_automation start")
    automation_manager = get_container().automation_store
    automation_manager.clear_automations()
    automations = await get_all_automation()
    for automation_item in automations:
        automation_manager.add_automation(automation_item)
    get_container().device_store.subscribe_patch_global("automation_device", automation_manager.on_device_patch)
    get_container().room_store.subscribe_patch_global("automation_room", automation_manager.on_room_patch)

    
