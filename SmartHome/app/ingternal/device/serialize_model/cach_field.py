from async_lru import alru_cache
from typing import Optional, List
from app.ingternal.device.models.device import Value, DeviceField
from pydantic import BaseModel

# Кеш последних значений
@alru_cache(maxsize=1000)
async def get_cached_last_value(field_id: int) -> Optional[str]:
	try:
		value = await Value.objects.filter(field__id=field_id).order_by("-datatime").first()
		return str(value.value) if value else None
	except Exception:
		# Логируем ошибку и не кэшируем её
		return None

# Функция для инвалидации кеша
def invalidate_cache_for_field(field_id: int):
	get_cached_last_value.cache_invalidate(field_id)

class CachFieldData(BaseModel):
	id: str
	name: str

@alru_cache(maxsize=1000)
async def get_cached_fields(system_name: int) -> Optional[List[CachFieldData]]:
	try:
		fields: List[DeviceField] = await DeviceField.objects.filter(device=system_name).all()
		value = [CachFieldData(id=item.id, name=item.name) for item in fields]
		return value
	except Exception:
		return None

def invalidate_cache_field(system_name: int):
	get_cached_fields.cache_invalidate(system_name)



