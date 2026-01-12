from app.db.repositories.room.get_room import get_room_all, get_room as get_room_1
from app.db.repositories.room.room_config_device import get_room as get_room_2
from async_lru import alru_cache

@alru_cache(maxsize=1000)
async def get_cached_room(room_name: str):
	try:
		return await get_room_1(room_name)
	except Exception:
		return None
	
def invalidate_cache_room(room_name:str):
	get_cached_room.cache_invalidate(room_name)

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
		rooms = await get_room_2()
		return rooms
	except Exception:
		return []

def invalidate_cache_room__type_device_data():
	get_cached_room_type_device_data.cache_invalidate()

