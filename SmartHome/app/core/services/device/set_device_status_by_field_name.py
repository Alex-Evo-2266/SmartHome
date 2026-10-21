from app.core.services.device.set_status import set_status
from app.db.cache.device.cach_field import get_cached_fields
from app.pkg.logger import MyLogger
from app.exceptions.device import DeviceNotFound

logger = MyLogger().get_logger(__name__)

async def set_status_by_field_name(system_name: str, field: str, value: str | int):
    device = await get_cached_fields(system_name)
    if not device:
        logger.error(f"Device '{system_name}' not found.")
        raise DeviceNotFound(f"Device '{system_name}' not found.")
    for field_cach in device:
        if field_cach.name == field:
            await set_status(system_name, field_cach.id, value)