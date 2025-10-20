from queue_lib import UniversalQueue
from app.ingternal.device.device_queue.handlers import handle_add, handle_delete, handle_edit_status, handle_value_set, AddItem, DeleteItem, EditStatusItem, ValueSetItem

import logging

logger = logging.getLogger(__name__)

__queue__ = UniversalQueue(
    logger=logger, 
    registrations={
        "add": (AddItem, handle_add),
        "delete": (DeleteItem, handle_delete),
        "edit_status": (EditStatusItem, handle_edit_status),
        "set_value": (ValueSetItem, handle_value_set)
    })