from app.db.models.device.device import DeviceField

def find_id(fields:list[DeviceField], uuid:str):
	for field in fields:
		if field.id == uuid:
			return field
	return None