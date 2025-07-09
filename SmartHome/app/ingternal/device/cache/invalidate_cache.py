from app.ingternal.device.cache.get_cached_device_data import invalidate_cache_device_data
from app.ingternal.device.cache.cach_field import invalidate_cache_field, invalidate_cache_for_field

def invalidate_cache():
    invalidate_cache_device_data()

def invalidate_cache_device_data_by_device(device):
	invalidate_cache_field(device)

def invalidate_cache_device_data_by_field(field):
	invalidate_cache_for_field(field)
