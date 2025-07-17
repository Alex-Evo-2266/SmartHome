from app.configuration.queue.universal_queue import UniversalQueue
from app.ingternal.device.device_queue.handlers import handle_add, handle_delete, handle_edit_status, handle_value_set, AddItem, DeleteItem, EditStatusItem, ValueSetItem

__queue__ = UniversalQueue(registrations={
    "add": (AddItem, handle_add),
    "delete": (DeleteItem, handle_delete),
    "edit_status": (EditStatusItem, handle_edit_status),
    "set_value": (ValueSetItem, handle_value_set)
})