
from typing import Dict, List, Optional, Callable, Awaitable, TypeVar, Generic
from pydantic import BaseModel, Field
from app.ingternal.logs import MyLogger
from app.ingternal.device.schemas.device import DeviceSerializeSchema
from datetime import datetime
import asyncio
import time

logger = MyLogger().get_logger(__name__)


class DeviceState(BaseModel):
    system_name: str
    state: Dict[str, Optional[str]] = Field(default_factory=dict)
    version: int = 0
    updated_at: float = Field(default_factory=lambda: time.time())

class DevicePatch(BaseModel):
    system_name: str
    changes: Dict[str, Optional[str]]
    version: int
    updated_at: float

class DeviceSnapshot(BaseModel):
    description: DeviceSerializeSchema
    system_name: str
    state: Dict[str, Optional[str]]
    version: int
    updated_at: float

    
async def safe_call(cb, arg):
    try:
        await cb(arg)
    except Exception:
        logger.exception("Global snapshot subscriber failed")

# NOTE:
# snapshot отправляется только при register_device
# при patch отправляется


class DeviceStatusStore():
    def __init__(self):
        self._descriptions: Dict[str, DeviceSerializeSchema] = {}
        self._states: Dict[str, DeviceState] = {}

        self._patch_subscribers: Dict[str, Dict[str, Callable[[DevicePatch], Awaitable[None]]]] = {}
        self._snapshot_subscribers: Dict[str, Dict[str, Callable[[DeviceSnapshot], Awaitable[None]]]] = {}
        self._global_patch_subscribers: Dict[str, Callable[[DevicePatch], Awaitable[None]]] = {}
        self._global_snapshot_subscribers: Dict[str, Callable[[List[DeviceSnapshot]], Awaitable[None]]] = {}

    # ------------------------------------------------------------------
    # Registration
    # ------------------------------------------------------------------

    def register_device(self, key: str, description: DeviceSerializeSchema):
        self._descriptions[key] = description

        if key not in self._states:
            self._states[key] = DeviceState(
                system_name=key
            )
        
        self._emit_snapshot(key)

    async def register_device_async(self, key: str, description: DeviceSerializeSchema):
        self._descriptions[key] = description

        if key not in self._states:
            self._states[key] = DeviceState(
                system_name=key
            )
        
        await self._emit_snapshot_async(key)

    # ------------------------------------------------------------------
    # State access
    # ------------------------------------------------------------------

    def get_state(self, system_name: str) -> Optional[DeviceState]:
        return self._states.get(system_name)

    def get_snapshot(self, system_name: str) -> Optional[DeviceSnapshot]:
        desc = self._descriptions.get(system_name)
        state = self._states.get(system_name)

        if not desc:
            return None
        
        if not state:
            return DeviceSnapshot(
                description=desc,
                system_name=desc.system_name,
                state={},
                version=0,
                updated_at=0.0
            )

        return DeviceSnapshot(
            description=desc,
            system_name=desc.system_name,
            state=state.state.copy(),
            version=state.version,
            updated_at=state.updated_at
        )

    def get_all_snapshots(self) -> List[DeviceSnapshot]:
        result = []
        for key in self._descriptions:
            snap = self.get_snapshot(key)
            if snap:
                result.append(snap)
        return result

    # ------------------------------------------------------------------
    # Patch update
    # ------------------------------------------------------------------

    def apply_patch(self, system_name: str, changes: Dict[str, str]):
        logger.debug(f"apply_patch_async: args: system_name={system_name}, changes={changes}")
        state = self._states.get(system_name)

        if not state:
            state = DeviceState(system_name=system_name)
            self._states[system_name] = state

        state.state = {**state.state, **changes}
        state.version += 1
        state.updated_at = time.time()

        patch = DevicePatch(
            system_name=system_name,
            changes=changes,
            version=state.version,
            updated_at=state.updated_at
        )

        asyncio.get_running_loop().create_task(
            self._emit_patch(patch)
        )
    
    async def apply_patch_async(self, system_name: str, changes: Dict[str, str]):
        logger.debug(f"apply_patch_async: args: system_name={system_name}, changes={changes}")
        state = self._states.get(system_name)

        if not state:
            state = DeviceState(system_name=system_name)
            self._states[system_name] = state

        state.state = {**state.state, **changes}
        state.version += 1
        state.updated_at = time.time()

        patch = DevicePatch(
            system_name=system_name,
            changes=changes,
            version=state.version,
            updated_at=state.updated_at
        )

        await self._emit_patch(patch)

    # ------------------------------------------------------------------
    # Emitters
    # ------------------------------------------------------------------

    async def _emit_patch(self, patch: DevicePatch):
        # device-specific
        subs = self._patch_subscribers.get(patch.system_name, {})
        logger.debug("start emit_patch")
        for cb in subs.values():
            try:
                await cb(patch)
            except Exception as e:
                logger.exception("Patch subscriber failed")

        # global
        for cb in self._global_patch_subscribers.values():
            try:
                await cb(patch)
            except Exception as e:
                logger.exception("Patch subscriber failed")

    def _emit_snapshot(self, system_name: str):
        snapshot = self.get_snapshot(system_name)
        if not snapshot:
            return
        
        logger.debug("start emit_snapshot")

        asyncio.get_running_loop().create_task(
            self._emit_send_snapshot(system_name, snapshot)
        )

        # global
        all_snapshots = self.get_all_snapshots()
        if len(all_snapshots) > 0:
            asyncio.get_running_loop().create_task(
                self._emit_send_all_snapshot(all_snapshots)
            )

    async def _emit_snapshot_async(self, system_name: str):
        snapshot = self.get_snapshot(system_name)
        if not snapshot:
            return
        
        logger.debug("start emit_snapshot")

        await self._emit_send_snapshot(system_name, snapshot)

        # global
        all_snapshots = self.get_all_snapshots()
        if len(all_snapshots) > 0:
            await self._emit_send_all_snapshot(all_snapshots)

    async def _emit_send_snapshot(self, system_name: str, snapshot):
        subs = self._snapshot_subscribers.get(system_name, {})
        for cb in subs.values():
            try:
                await cb(snapshot)
            except Exception as e:
                logger.exception("Patch subscriber failed")

    async def _emit_send_all_snapshot(self, all_snapshots):
        for cb in self._global_snapshot_subscribers.values():
            try:
                await cb(all_snapshots)
            except Exception as e:
                logger.exception("Patch subscriber failed")

    # ------------------------------------------------------------------
    # Subscriptions
    # ------------------------------------------------------------------

    def subscribe_patch(
        self,
        system_name: str,
        sub_id: str,
        callback: Callable[[DevicePatch], Awaitable[None]]
    ):
        logger.debug("subscribe_patch system_name: %s, sub_id: %s", system_name, sub_id)
        
        self._patch_subscribers.setdefault(system_name, {})[sub_id] = callback

    def unsubscribe_patch(self, system_name: str, sub_id: str):
        logger.debug("unsubscribe_patch system_name: %s, sub_id: %s", system_name, sub_id)

        self._patch_subscribers.get(system_name, {}).pop(sub_id, None)

    def subscribe_patch_global(
        self,
        sub_id: str,
        callback: Callable[[DevicePatch], Awaitable[None]]
    ):
        logger.debug("subscribe_patch_global sub_id: %s", sub_id)
        
        self._global_patch_subscribers[sub_id] = callback

    def unsubscribe_patch_global(self, sub_id: str):
        logger.debug("unsubscribe_patch_global sub_id: %s", sub_id)

        self._global_patch_subscribers.pop(sub_id, None)


    def subscribe_snapshot(
        self,
        system_name: str,
        sub_id: str,
        callback: Callable[[DeviceSnapshot], Awaitable[None]],
        emit_initial: bool = True
    ):
        logger.debug("subscribe_snapshot system_name: %s, sub_id: %s", system_name, sub_id)
        
        self._snapshot_subscribers.setdefault(system_name, {})[sub_id] = callback

        snap = self.get_snapshot(system_name)
        if emit_initial and snap:
            asyncio.create_task(safe_call(callback, snap))

    
    async def subscribe_snapshot_async(
        self,
        system_name: str,
        sub_id: str,
        callback: Callable[[DeviceSnapshot], Awaitable[None]],
        emit_initial: bool = True
    ):
        logger.debug("subscribe_snapshot_async system_name: %s, sub_id: %s", system_name, sub_id)
        
        self._snapshot_subscribers.setdefault(system_name, {})[sub_id] = callback

        snap = self.get_snapshot(system_name)
        if emit_initial and snap:
            await safe_call(callback, snap)

    def unsubscribe_snapshot(self, system_name: str, sub_id: str):
        logger.debug("unsubscribe_snapshot system_name: %s, sub_id: %s", system_name, sub_id)

        self._snapshot_subscribers.get(system_name, {}).pop(sub_id, None)

    def subscribe_snapshot_global(
        self,
        sub_id: str,
        callback: Callable[[List[DeviceSnapshot]], Awaitable[None]],
        emit_initial: bool = True
    ):
        logger.debug("subscribe_snapshot_global sub_id: %s", sub_id)
        
        self._global_snapshot_subscribers[sub_id] = callback

        all_snapshots = self.get_all_snapshots()
        if emit_initial and len(all_snapshots) > 0:
            asyncio.create_task(safe_call(callback, all_snapshots))

    async def subscribe_snapshot_global_async(
        self,
        sub_id: str,
        callback: Callable[[List[DeviceSnapshot]], Awaitable[None]],
        emit_initial: bool = True
    ):
        logger.debug("subscribe_snapshot_global_async sub_id: %s", sub_id)

        self._global_snapshot_subscribers[sub_id] = callback

        all_snapshots = self.get_all_snapshots()
        if emit_initial and len(all_snapshots) > 0:
            await safe_call(callback, all_snapshots)


    def unsubscribe_snapshot_global(self, sub_id: str):
        logger.debug("unsubscribe_snapshot_global sub_id: %s", sub_id)

        self._global_snapshot_subscribers.pop(sub_id, None)

    def remove_device(self, system_name: str) -> bool:
        """
        Remove device and all its device-specific subscribers.
        Returns True if device existed and was removed.
        """
        existed = False

        if system_name in self._descriptions:
            del self._descriptions[system_name]
            existed = True

        if system_name in self._states:
            del self._states[system_name]
            existed = True

        # remove device-specific subscribers
        self._patch_subscribers.pop(system_name, None)
        self._snapshot_subscribers.pop(system_name, None)

        return existed

store = DeviceStatusStore()