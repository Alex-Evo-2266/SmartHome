from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.schemas.enums import DeviceGetData
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.modules.struct.DeviceStatusStore import store
from app.configuration.settings import POLLING_INTERVAL, LOOP_DEVICE_POLLING
from app.ingternal.logs import MyLogger
from app.configuration.loop.loop import loop
from app.pkg import __config__
import asyncio
import time

POLL_CONCURRENCY = 10
_poll_sem = asyncio.Semaphore(POLL_CONCURRENCY)

_last_poll_times: dict[str, float] = {}

logger = MyLogger().get_logger(__name__)

async def poll_device(item):
    async with _poll_sem:
        device:IDevice = item.device
        device_id = item.id

        # ---------------- ТРОТТЛИНГ ----------------
        (interval, timeout) = device.get_poll_config()
        now = time.monotonic()
        last = _last_poll_times.get(device_id, 0)
        if now - last < interval:
            logger.debug("Skipping polling for %s (throttled)", device_id)
            return
        _last_poll_times[device_id] = now
        # -------------------------------------------

        if not device.is_conected:
            logger.debug(
                "Polling skipped: device %s is not connected",
                device_id
            )
            return

        logger.debug(
            "Polling started for device %s (%s)",
            device_id,
            device.__class__.__name__
        )

        start_time = time.monotonic()

        try:
            try:
                patch = await asyncio.wait_for(
                    device.async_load(),
                    timeout=timeout
                )
            except asyncio.TimeoutError:
                logger.warning(
                    "Polling timeout for device %s (>%s sec)",
                    device_id,
                    timeout
                )
                return

            if patch:
                await store.apply_patch_async(device_id, patch)
                logger.debug(
                    "Polling success: device %s, patch keys=%s",
                    device_id,
                    list(patch.keys())
                )
            else:
                logger.debug(
                    "Polling completed: device %s, no changes",
                    device_id
                )

        except Exception as exc:
            logger.exception(
                "Polling failed for device %s: %s",
                device_id,
                exc
            )

        finally:
            elapsed = time.monotonic() - start_time
            logger.debug(
                "Polling finished for device %s in %.3f sec",
                device_id,
                elapsed
            )



async def device_poll():
    logger.debug("Device polling cycle started")

    items = [
        item
        for item in DevicesArray.all()
        if item.device.get_type_get_data() == DeviceGetData.PULL
    ]

    if not items:
        logger.debug("No PULL devices found for polling")
        return

    logger.info(
        "Polling %d device(s) (concurrency=%d)",
        len(items),
        POLL_CONCURRENCY
    )

    tasks = [poll_device(item) for item in items]

    try:
        await asyncio.gather(*tasks)
    except Exception:
        # на случай, если что-то пошло совсем не так
        logger.exception("Unexpected error during device polling cycle")

    logger.debug("Device polling cycle finished")


async def restart_polling():
    logger.info("Restarting device polling process")

    frequency = __config__.get(POLLING_INTERVAL)
    interval = int(frequency.value) if frequency and frequency.value else 6

    logger.info(
        "Register polling loop: interval=%s sec, task=%s",
        interval,
        LOOP_DEVICE_POLLING
    )

    loop.register(
        LOOP_DEVICE_POLLING,
        device_poll,
        interval
    )
