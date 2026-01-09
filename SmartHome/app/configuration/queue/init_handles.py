from app.ingternal.device.device_queue.handlers import handle_add, handle_delete, handle_edit_status, handle_value_set, handle_init_device, InitDeviceItem, AddItem, DeleteItem, EditStatusItem, ValueSetItem
from app.configuration.queue import __queue__

def register_queue():
    __queue__.register("add", AddItem, handle_add)
    __queue__.register("delete", DeleteItem, handle_delete)
    __queue__.register("edit_status", EditStatusItem, handle_edit_status)
    __queue__.register("set_value", ValueSetItem, handle_value_set)
    __queue__.register("init_device", InitDeviceItem, handle_init_device)
    # registrations={
    #     "add": (AddItem, handle_add),
    #     "delete": (DeleteItem, handle_delete),
    #     "edit_status": (EditStatusItem, handle_edit_status),
    #     "set_value": (ValueSetItem, handle_value_set),
    #     "init_device": (InitDeviceItem, handle_init_device)
    # })