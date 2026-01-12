from app.core.state.device_store import DeviceStatusStore
from app.core.state.room_store import RoomStateStore
from app.core.state.connect_store import DevicesArray
from app.core.state.class_store import DeviceClasses
from app.core.state.automation_store import AutomationManager
from app.core.entities.device.types.register_type import types

class StoreContainer:
    def __init__(self):
        self.class_store = DeviceClasses()
        self.device_store = DeviceStatusStore()
        self.connect_store = DevicesArray()
        self.room_store = RoomStateStore()
        self.automation_store = AutomationManager()

        try:
            for type_device in types:
                self.room_store.register_type(type_device)
        except Exception as e:
            print(e)

        self.device_store.subscribe_patch_global("room_state", self.room_store.on_device_patch)
        self.device_store.subscribe_snapshot_global("room_state", self.room_store.on_device_snapshot)