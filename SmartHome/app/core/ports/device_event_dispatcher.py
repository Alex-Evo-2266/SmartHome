from typing import Dict, List, Optional, Callable, Awaitable, TypeVar, Generic
from pydantic import BaseModel, Field
from app.core.state.device_store import DeviceStatusStore
from app.core.state.get_store import get_container
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

        await self._store.apply_patch_async(
            event.system_name,
            event.changes
        )


dispatcher = DeviceEventDispatcher(get_container().device_store)