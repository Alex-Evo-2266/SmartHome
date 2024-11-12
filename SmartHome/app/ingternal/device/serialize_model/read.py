# from typing import List
# from app.ingternal.device.models.device import Device, DeviceField
# from app.ingternal.device.schemas.device import DeviceSchema
# from app.ingternal.device.arrays.DeviceDataArray import DevicesDataArrey
# from app.ingternal.device.exceptions.device import DeviceNotFound

# async def get_all_device():
# 	# devices: List[Device] = await Device.objects.all()
# 	# arr:List[DeviceSchema] = []
# 	arr = DevicesDataArrey.get_all_device()
# 	return arr
	
# async def get_device(system_name: str):
# 	device_data = DevicesDataArrey.get(system_name)
# 	if device_data:
# 		return device_data.device
# 	raise DeviceNotFound()

# async def get_device_row(system_name: str)->Device:
# 	device = await Device.objects.get_or_none(system_name=system_name)
# 	if device:
# 		return device
# 	raise DeviceNotFound()

# async def get_field_row(system_name: str, field_name: str)->DeviceField:
# 	device = await get_device_row(system_name)
# 	fields:DeviceField = await DeviceField.objects.get_or_none(device=device, name=field_name)
# 	if fields:
# 		return fields
# 	raise DeviceNotFound()