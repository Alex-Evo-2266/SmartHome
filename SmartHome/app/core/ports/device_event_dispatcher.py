from typing import Dict, List, Optional, Callable, Awaitable, TypeVar, Generic
from pydantic import BaseModel, Field
from app.core.state.device_store import DeviceStatusStore
from app.core.state.get_store import get_container
from app.schemas.device.device import TypeDeviceField
from app.pkg.logger import MyLogger
from app.core.state.event import DeviceEvent

logger = MyLogger().get_logger(__name__)

class DeviceEventDispatcher:
    def __init__(self, store: DeviceStatusStore):
        self._store = store

    async def emit(self, event: DeviceEvent):
        """
        Unified entry point for ALL device updates
        """
        logger.debug(
            "DeviceEvent: %s from %s -> %s",
            event.system_name,
            event.source,
            event.changes
        )

        # здесь можно добавить:
        # - валидацию
        # - фильтрацию
        # - debounce / throttle
        # - агрегацию
        try:
            snapshot = self._store.get_snapshot(event.system_name)
            for field in snapshot.description.fields:
                if field.name in event.changes:
                    if field.type == TypeDeviceField.BINARY:
                        if event.changes[field.name].lower() == "true":
                            event.changes[field.name] = "1"
                        if event.changes[field.name].lower() == "false":
                            event.changes[field.name] = "0"
            
            await self._store.apply_patch_async(
            event.system_name,
            event.changes
        )
        except Exception as e:
            logger.error(f"Error serialise event: {e}")
            raise

        

dispatcher = DeviceEventDispatcher(get_container().device_store)