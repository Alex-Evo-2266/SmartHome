from app.configuration.queue.types import QueueItem
from typing import Any
from app.ingternal.logs import get_base_logger
from app.ingternal.device.serialize_model.create import add_device
from app.ingternal.device.serialize_model.delete import delete_device
from app.ingternal.device.serialize_model.update import edit_status_device
from app.ingternal.device.set_device_status_by_field_name import set_status_by_field_name
from app.ingternal.device.schemas.add_device import AddDeviceSchema

logger = get_base_logger.get_logger(__name__)

class AddItem(QueueItem):
	type: str = "add"
	object: AddDeviceSchema

class DeleteItem(QueueItem):
	type: str = "delete"
	system_name: str

class EditStatusItem(QueueItem):
	type: str = "edit_status"
	system_name: str
	status: bool

class ValueSetItem(QueueItem):
	type: str = "set_value"
	system_name: str
	field: str
	value: str | int


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