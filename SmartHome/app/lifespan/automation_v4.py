from app.core.entities.automation.automation_v4 import run_adapter
from app.core.state.get_store import get_container
from app.db.repositories.automation_v4.automation_io import automation_storage
from app.scheduler import scheduler


async def run_due_automations():
    await get_container().automation_store.run_due_automations()


async def start_automation():
    container = get_container()
    manager = container.automation_store
    manager.register_collback(run_adapter)
    manager.clear_automations()

    for automation in automation_storage.load_all():
        manager.add_automation(automation)

    container.device_store.subscribe_patch_global(
        "automation_device", manager.on_device_patch
    )
    container.room_store.subscribe_patch_global(
        "automation_room", manager.on_room_patch
    )

    scheduler.add_job(
        run_due_automations,
        trigger="interval",
        minutes=1,
        id="automation-v4-run-due",
        replace_existing=True,
    )
