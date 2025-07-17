from app.ingternal.device.set_device_status import set_status
from app.ingternal.device.cache.cach_field import get_cached_fields

async def set_status_by_field_name(system_name: str, field: str, value: str):
    print("p556")
    device = await get_cached_fields(system_name)
    for field_cach in device:
        if field_cach.name == field:
            await set_status(system_name, field_cach.id, value)