from app.pkg.logger import get_base_logger
from app.db.repositories.device.create import add_device
from app.db.repositories.device.delete import delete_device
from app.db.repositories.device.update import edit_status_device
from app.core.services.device.set_device_status_by_field_name import set_status_by_field_name
from app.core.runtime.device.init import init
from app.core.entities.device.device_queue.types import AddItem, DeleteItem, EditStatusItem, ValueSetItem, InitDeviceItem

logger = get_base_logger.get_logger(__name__)

async def handle_add(item: AddItem):
	logger.debug(f"Adding device: {item.object}")
	await add_device(item.object)
	logger.debug("Device added successfully")

async def handle_delete(item: DeleteItem):
	logger.debug(f"Deleting device: {item.system_name}")
	await delete_device(item.system_name)
	logger.debug("Device deleted successfully")

async def handle_edit_status(item: EditStatusItem):
	logger.info(f"Deleting device: {item.system_name}")
	await edit_status_device(item.system_name, item.status)
	logger.debug("Device update status successfully")

async def handle_value_set(item: ValueSetItem):
	logger.info(f"Deleting device: {item.system_name}")
	await set_status_by_field_name(item.system_name, item.field, item.value)
	logger.debug("Device update status successfully")

async def handle_init_device(item: InitDeviceItem):
	logger.debug(f"init device: {item.system_name}")
	await init(item.system_name, item.try_count)
	logger.debug("Device init finish")