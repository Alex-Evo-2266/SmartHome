from app.core.services.device.set_status import set_status
from app.db.cache.device.cach_field import get_cached_fields

async def set_status_by_field_name(system_name: str, field: str, value: str):
    device = await get_cached_fields(system_name)
    for field_cach in device:
        if field_cach.name == field:
            await set_status(system_name, field_cach.id, value)