from async_lru import alru_cache
from app.db.repositories.device.read import get_all_row_device

@alru_cache(maxsize=1000)
async def get_cached_device_data():
	try:
		devices_data = await get_all_row_device()
		return devices_data
	except Exception:
		return []

def invalidate_cache_device_data():
	get_cached_device_data.cache_invalidate()

