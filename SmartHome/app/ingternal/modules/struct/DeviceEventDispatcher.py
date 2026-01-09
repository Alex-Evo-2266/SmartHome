from typing import Dict, List, Optional, Callable, Awaitable, TypeVar, Generic
from pydantic import BaseModel, Field
from app.ingternal.modules.struct.DeviceStatusStore import store, DeviceStatusStore
from app.ingternal.logs import MyLogger
import time

logger = MyLogger().get_logger(__name__)

class DeviceEvent(BaseModel):
    system_name: str
    source: str              # mqtt / matter / poll / http
    changes: Dict[str, Optional[str]]
    timestamp: float = Field(default_factory=time.time)

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

        await self._store.apply_patch_async(
            event.system_name,
            event.changes
        )

dispatcher = DeviceEventDispatcher(store)