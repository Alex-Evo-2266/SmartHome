from async_lru import alru_cache
from typing import Optional, List, Tuple
from app.ingternal.device.models.device import Value, DeviceField
from app.ingternal.device.schemas.enums import StatusDevice
from pydantic import BaseModel

# Кеш последних значений
@alru_cache(maxsize=1000)
async def get_cached_last_value(field_id: str) -> Optional[Tuple[str,StatusDevice]]:
	try:
		value: Value = await Value.objects.filter(field__id=field_id).order_by("-datatime").first()
		return (str(value.value), value.status_device) if value else (None, None)
	except Exception:
		# Логируем ошибку и не кэшируем её
		return (None, None)

# Функция для инвалидации кеша
def invalidate_cache_for_field(field_id: str):
	get_cached_last_value.cache_invalidate(field_id)

class CachFieldData(BaseModel):
	id: str
	name: str

@alru_cache(maxsize=1000)
async def get_cached_fields(system_name: str) -> Optional[List[CachFieldData]]:
	try:
		fields: List[DeviceField] = await DeviceField.objects.filter(device=system_name).all()
		value = [CachFieldData(id=item.id, name=item.name) for item in fields]
		return value
	except Exception:
		return None

def invalidate_cache_field(system_name: str):
	get_cached_fields.cache_invalidate(system_name)



