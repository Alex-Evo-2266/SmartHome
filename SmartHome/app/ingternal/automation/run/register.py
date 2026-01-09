from app.ingternal.automation.arrays.automation import AutomationManager
from app.ingternal.automation.run.automation import automation
from app.ingternal.automation.serialize_model.get_model import get_all_automation
from app.ingternal.modules.struct.DeviceStatusStore import store
from app.ingternal.modules.struct.RoomStateStore import room_store
from app.ingternal.logs import MyLogger

from app.configuration.loop.loop import loop

logger = MyLogger().get_logger(__name__)

automation_manager = AutomationManager(automation)

async def register_automation():
    logger.debug("register_automation start")
    automation_manager.clear_automations()
    automations = await get_all_automation()
    for automation_item in automations:
        automation_manager.add_automation(automation_item)
    store.subscribe_patch_global("automation_device", automation_manager.on_device_patch)
    room_store.subscribe_patch_global("automation_room", automation_manager.on_room_patch)

    
