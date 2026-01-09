# app/internal/device/events/interface.py

from typing import Dict, Any, Protocol

class DeviceStateEmitter(Protocol):
    async def emit(
        self,
        system_name: str,
        changes: Dict[str, str],
        meta: Dict[str, Any] | None = None
    ) -> None:
        ...
