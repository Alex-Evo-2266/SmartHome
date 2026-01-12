import asyncio
import uuid
import time
from datetime import datetime
from typing import Dict, Tuple, Optional, List
from app.core.state.get_store import get_container

from app.pkg.logger import MyLogger
from app.core.state.device_store import (
    DevicePatch,
    DeviceStatusStore,
)
from app.schemas.device.device import DeviceSerializeSchema
from app.schemas.device.enums import StatusDevice
from app.db.models.device.device import Value 


logger = MyLogger().get_logger(__name__)


class DeviceHistoryWriter:
    def __init__(
        self,
        store: DeviceStatusStore,
        batch_size: int = 100,
        flush_interval: float = 1.0,
        min_field_interval: float = 0.05,
    ):
        self.store = store

        self.batch_size = batch_size
        self.flush_interval = flush_interval
        self.min_field_interval = min_field_interval

        self._buffer: List[Value] = []
        self._buffer_lock = asyncio.Lock()

        # (device, field) -> (last_value, last_ts)
        self._last_written: Dict[Tuple[str, str], Tuple[Optional[str], float]] = {}

        self._flush_task: Optional[asyncio.Task] = None
        self._running = True


    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def start(self):
        self._start_flush_loop()


    async def on_patch(self, patch: DevicePatch):
        snap = self.store.get_snapshot(patch.system_name)
        if not snap:
            return

        device: DeviceSerializeSchema = snap.description
        if not device.fields:
            return

        now = time.time()

        for field_name, value in patch.changes.items():
            field = next(
                (f for f in device.fields if f.name == field_name),
                None
            )
            if not field:
                continue

            key = (patch.system_name, field.id)
            last = self._last_written.get(key)

            # debounce per field
            if last:
                last_value, last_ts = last
                if last_value == value and (now - last_ts) < self.min_field_interval:
                    continue

            self._last_written[key] = (value, now)

            record = Value(
                id=str(uuid.uuid4()),
                datatime=datetime.fromtimestamp(patch.updated_at).isoformat(),
                value=str(value) if value is not None else None,
                status_device=StatusDevice.ONLINE,
                field=field.id,
            )

            await self._add_to_buffer(record)

    async def shutdown(self):
        self._running = False
        if self._flush_task:
            self._flush_task.cancel()

        await self._flush()

    # ------------------------------------------------------------------
    # Buffer logic
    # ------------------------------------------------------------------

    async def _add_to_buffer(self, record: Value):
        async with self._buffer_lock:
            self._buffer.append(record)

            if len(self._buffer) >= self.batch_size:
                await self._flush_locked()

    async def _flush(self):
        async with self._buffer_lock:
            await self._flush_locked()

    async def _flush_locked(self):
        if not self._buffer:
            return

        batch = self._buffer
        self._buffer = []

        try:
            await Value.objects.bulk_create(batch)
            logger.debug("History flush: %d records", len(batch))
        except Exception:
            logger.exception("Failed to flush history batch")

    # ------------------------------------------------------------------
    # Periodic flush
    # ------------------------------------------------------------------

    def _start_flush_loop(self):
        self._flush_task = asyncio.create_task(self._flush_loop())

    async def _flush_loop(self):
        try:
            while self._running:
                await asyncio.sleep(self.flush_interval)
                await self._flush()
        except asyncio.CancelledError:
            pass

history = DeviceHistoryWriter(get_container().device_store)

