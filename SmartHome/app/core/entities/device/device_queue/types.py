from queue_lib import QueueItem
from app.schemas.device.add_device import AddDeviceSchema

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

class InitDeviceItem(QueueItem):
	type: str = "init_device"
	system_name: str
	try_count: int
