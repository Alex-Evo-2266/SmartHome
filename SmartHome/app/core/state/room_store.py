from typing import Dict, List, Optional, Callable, Awaitable, Any, Tuple
from pydantic import BaseModel, Field
from collections import defaultdict
import asyncio
import time

from app.pkg.logger import MyLogger
from app.schemas.device.enums import TypeDeviceField
from app.core.state.event import DevicePatch, DeviceSnapshot
from app.schemas.device.BaseTypeClass import DeviceType
from app.schemas.device.device_type import FieldDeviceTypeSchema
from app.schemas.device.device import DeviceSerializeSchema
from app.schemas.device.types_names import TypesDeviceEnum
from app.core.state.event import RoomDevicePatch, RoomSnapshot, RoomDeviceSnapshot

logger = MyLogger().get_logger(__name__)


class RoomDeviceState(BaseModel):
    room: str
    type_name: str
    state: Dict[str, Any] = Field(default_factory=dict)
    version: int = 0
    updated_at: float = Field(default_factory=lambda: time.time())

async def safe_call(cb, arg):
    try:
        await cb(arg)
    except Exception:
        logger.exception("Global snapshot subscriber failed")

# NOTE:
# snapshot отправляется только при register_device
# при patch отправляется


class RoomStateStore:
    def __init__(self):
        self._state: Dict[str, Dict[str, RoomDeviceState]] = {}
        self.device_field_map: Dict[tuple[str, str], tuple[str, str, str, TypeDeviceField]] = {}
        self.row_state: Dict[
            str,
            Dict[str, Dict[str, Dict[str, Any]]]
        ] = dict()
        self.last_device_snapshot: Dict[str, DeviceSnapshot] = {}

        self.device_types: Dict[str, Dict[str, FieldDeviceTypeSchema]] = {}

        self._global_patch_subscribers: Dict[str, Callable[[RoomDevicePatch], Awaitable[None]]] = {}
        self._global_snapshot_subscribers: Dict[str, Callable[[List[RoomSnapshot]], Awaitable[None]]] = {}

    def register_type(self, device_type:DeviceType):
        self.device_types[str(device_type.name)] = device_type.fields

    async def on_device_snapshot(self, snapshots: List[DeviceSnapshot]):
        try:
            await self._recalculate(snapshots)
        except Exception as e:
            print(e)

    async def on_device_patch(self, patch: DevicePatch):
        system_name = patch.system_name
        values:Dict[str, Dict[str, Dict[str, List[str | None]]]] = {}
        for field_name, value in patch.changes.items():
            key = (system_name, field_name)
            room_struct = self.device_field_map.get(key, None)
            if room_struct is None:
                continue
            (room, virtual_device, field, type_field) = room_struct
            if not room in self.row_state:
                self.row_state[room] = dict()
            if not virtual_device in self.row_state[room]:
                self.row_state[room][virtual_device] = dict()
            if not system_name in self.row_state[room][virtual_device]:
                self.row_state[room][virtual_device][system_name] = dict()
            self.row_state[room][virtual_device][system_name][field] = value
        await self._aggregate_fields()

    def aggregate_field(
        self,
        type_field: TypeDeviceField,
        values: List[Any]
    ) -> Any:
        if not values:
            return None

        if type_field == TypeDeviceField.BINARY:
            return "1" if "1" in values else "0"

        if type_field == TypeDeviceField.NUMBER:
            nums = [float(v) for v in values if v is not None]
            if not nums:
                return None
            return str(int(sum(nums) / len(nums)))

        try:
            return next(x for x in values if x is not None)
        except StopIteration:
            return None


    async def _recalculate(self, snapshots: List[DeviceSnapshot]):
        # room -> type -> field -> list(values)

        # 1️⃣ собираем данные
        for sn in snapshots:
            self.last_device_snapshot[sn.system_name] = sn
            device: DeviceSerializeSchema = sn.description
            room = device.room
            if not room:
                continue
            
            for device_type in device.all_types:
                type_name = device_type.name_type

                for field in device_type.fields:
                    try:
                        device_field = next(
                            f for f in device.fields
                            if f.id == field.id_field_device
                        )
                    except StopIteration:
                        continue
                    
                    key = (device.system_name, device_field.name)
                    self.device_field_map[key] = (room, type_name, field.name_field_type, field.field_type)
                    value = sn.state.get(device_field.name)

                    if not room in self.row_state:
                        self.row_state[room] = dict()
                    if not type_name in self.row_state[room]:
                        self.row_state[room][type_name] = dict()
                    if not device.system_name in self.row_state[room][type_name]:
                        self.row_state[room][type_name][device.system_name] = dict()
                    self.row_state[room][type_name][device.system_name][field.name_field_type] = value

        await self._aggregate_fields()

    async def _aggregate_fields(self):
        for room, types in self.row_state.items():
            for type_name, devices in types.items():
                aggregated: Dict[str, Any] = {}
                type_schema = self.device_types.get(str(TypesDeviceEnum[type_name]), {})
                values_dict:Dict[str, tuple[TypeDeviceField, List[str | None]]] = dict()
                for system_name, values in devices.items():
                    for field_name, value in values.items():
                        try:
                            field_schema = type_schema.get(field_name, None)
                            if not field_schema:
                                continue
                            if not field_name in values_dict:
                                values_dict[field_name] = (field_schema.type_field, [])
                            values_dict[field_name][1].append(value)
                        except Exception as e:
                            print(e)
                

                for field_name, (type_field, values) in values_dict.items():
                    aggregated[field_name] = self.aggregate_field(
                        type_field,
                        values
                    )
                await self._apply_room_state(room, type_name, aggregated)


    
    async def _apply_room_state(
        self,
        room: str,
        type_name: str,
        new_state: Dict[str, Any]
    ):
        room_states = self._state.get(room, {})
        state = room_states.get(type_name)
        if not state:
            state = RoomDeviceState(
                room=room,
                type_name=type_name,
                state=new_state
            )
            room_states[type_name] = state
            self._state[room] = room_states
            await self._emit_snapshot_async()
            return

        if state.state != new_state:
            changes = {
                k: v for k, v in new_state.items()
                if state.state.get(k) != v
            }

            state.state = new_state
            state.version += 1
            state.updated_at = time.time()

            await self._emit_patch(RoomDevicePatch(
                room=room,
                type_name=type_name,
                changes=changes,
                version=state.version,
                updated_at=state.updated_at
            ))

    def get_all_snapshots(self):
        rooms = []
        for room, devices in self._state.items():
            devices_data = []
            for device, device_model in devices.items():
                devices_data.append(RoomDeviceSnapshot(**device_model.model_dump()))
            rooms.append(RoomSnapshot(
                room=room,
                devices=devices_data
            ))
        return rooms

    def get_field_type(self, room, device, field):
        for (_room, _device, _filed, type_field) in self.device_field_map.values():
            if room == _room and device == _device and field == _field:
                return type_field
        return None

    def get_snapshot(self, room: str, system_name: str):
        for room, devices in self._state.items():
            if room == room:
                for device, device_model in devices.items():
                    if system_name == device:
                        return RoomDeviceSnapshot(**device_model.model_dump())
        return None
    
    async def _emit_patch(self, patch: RoomDevicePatch):
        # device-specific
        # subs = self._patch_subscribers.get(patch.system_name, {})
        # logger.debug("start emit_patch")
        # for cb in subs.values():
        #     try:
        #         await cb(patch)
        #     except Exception as e:
        #         logger.exception("Patch subscriber failed")

        # global
        for cb in self._global_patch_subscribers.values():
            try:
                await cb(patch)
            except Exception as e:
                logger.exception("Patch subscriber failed")

    def _emit_snapshot(self, system_name: str):
        
        logger.debug("start emit_snapshot")

        # global
        all_snapshots = self.get_all_snapshots()
        if len(all_snapshots) > 0:
            asyncio.get_running_loop().create_task(
                self._emit_send_all_snapshot(all_snapshots)
            )

    async def _emit_snapshot_async(self):

        logger.debug("start emit_snapshot")

        # global
        all_snapshots = self.get_all_snapshots()
        if len(all_snapshots) > 0:
            await self._emit_send_all_snapshot(all_snapshots)

    async def _emit_send_all_snapshot(self, all_snapshots):
        for cb in self._global_snapshot_subscribers.values():
            try:
                await cb(all_snapshots)
            except Exception as e:
                logger.exception("Patch subscriber failed")
    
    # ------------------------------------------------------------------
    # Subscriptions
    # ------------------------------------------------------------------

    def subscribe_patch_global(
        self,
        sub_id: str,
        callback: Callable[[RoomDevicePatch], Awaitable[None]]
    ):
        self._global_patch_subscribers[sub_id] = callback

    def unsubscribe_patch_global(self, sub_id: str):
        self._global_patch_subscribers.pop(sub_id, None)


    def subscribe_snapshot_global(
        self,
        sub_id: str,
        callback: Callable[[List[RoomSnapshot]], Awaitable[None]],
        emit_initial: bool = True
    ):
        self._global_snapshot_subscribers[sub_id] = callback

        all_snapshots = self.get_all_snapshots()
        if emit_initial and len(all_snapshots) > 0:
            asyncio.create_task(safe_call(callback, all_snapshots))

    async def subscribe_snapshot_global_async(
        self,
        sub_id: str,
        callback: Callable[[List[RoomSnapshot]], Awaitable[None]],
        emit_initial: bool = True
    ):
        

        all_snapshots = self.get_all_snapshots()
        if emit_initial and len(all_snapshots) > 0:
            await safe_call(callback, all_snapshots)


    def unsubscribe_snapshot_global(self, sub_id: str):
        self._global_snapshot_subscribers.pop(sub_id, None)
