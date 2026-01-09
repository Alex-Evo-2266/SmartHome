# app/internal/device/events/emitter.py

from app.ingternal.modules.struct.DeviceStatusStore import store
from app.ingternal.device.arrays.DevicesArray import DevicesArray
import logging

logger = logging.getLogger(__name__)

class CoreDeviceStateEmitter:
    async def emit(
        self,
        system_name: str,
        changes: dict[str, str],
        meta: dict | None = None
    ):
        # 1. store — источник истины
        await store.apply_patch_async(system_name, changes)

        # 2. device instance (опционально)
        item = DevicesArray.get(system_name)
        if not item:
            return

        device = item.device
        for field_id, value in changes.items():
            try:
                device.set_value(field_id, value)
            except Exception:
                logger.exception(
                    f"Failed to set {field_id} on {system_name}"
                )
