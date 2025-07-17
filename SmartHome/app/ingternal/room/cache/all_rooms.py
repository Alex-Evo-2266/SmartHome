from app.ingternal.room.serialize_model.get_room import get_room_all
from app.ingternal.room.serialize_model.room_config_device import get_room
from async_lru import alru_cache

@alru_cache(maxsize=1000)
async def get_cached_room_data():
	try:
		rooms = await get_room_all()
		return rooms
	except Exception:
		return []

def invalidate_cache_room_data():
	get_cached_room_data.cache_invalidate()


@alru_cache(maxsize=1000)
async def get_cached_room_type_device_data():
	try:
		rooms = await get_room()
		return rooms
	except Exception:
		return []

def invalidate_cache_room__type_device_data():
	get_cached_room_type_device_data.cache_invalidate()

