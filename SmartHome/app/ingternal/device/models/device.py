import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional, Dict, Union
from app.ingternal.device.schemas.enums import ReceivedDataFormat, TypeDeviceField, DeviceGetData, DeviceStatusField, StatusDevice


class Device(ormar.Model):
	ormar_config = base_ormar_config.copy()

	name: str = ormar.String(max_length=200)
	system_name: str = ormar.String(max_length=200, primary_key=True)
	class_device: str = ormar.String(max_length=200)
	type: Optional[str] = ormar.String(max_length=200, nullable=True)
	address: Optional[str] = ormar.String(max_length=200, nullable=True)
	token: Optional[str] = ormar.String(max_length=200, nullable=True)
	type_command: ReceivedDataFormat = ormar.String(max_length=200, default=ReceivedDataFormat.JSON)
	type_get_data: DeviceGetData = ormar.String(max_length=200, default=DeviceGetData.PUSH)
	status: DeviceStatusField = ormar.String(max_length=200, default=DeviceStatusField.LINK)
	
class DeviceField(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	name: str = ormar.String(max_length=200)
	address: Optional[str] = ormar.String(max_length=200, nullable=True)
	type: TypeDeviceField = ormar.String(max_length=200)
	low: Optional[str] = ormar.String(max_length=200, nullable=True)
	high: Optional[str] = ormar.String(max_length=200, nullable=True)
	enum_values: Optional[str] = ormar.String(max_length=200, nullable=True)
	read_only: bool = ormar.Boolean()
	icon: str = ormar.String(max_length=200, default="room")
	unit: Optional[str] = ormar.String(max_length=200, default="")
	entity: Optional[str] = ormar.String(max_length=100, nullable=True)
	virtual_field: bool = ormar.Boolean(default=False)
	device: Optional[Union[Device, Dict]] = ormar.ForeignKey(Device, related_name="fields", ondelete=ReferentialAction.CASCADE)

class Value(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	datatime: str = ormar.String(max_length=20)
	value: str = ormar.String(max_length=500)
	status_device: StatusDevice = ormar.String(max_length=50, default=StatusDevice.ONLINE)
	field: Optional[Union[DeviceField, Dict]] = ormar.ForeignKey(DeviceField, related_name="values", ondelete=ReferentialAction.CASCADE)



# class DeviceHistory(ormar.Model):
# 	ormar_config = base_ormar_config.copy()

# 	id: str = ormar.String(max_length=100, primary_key=True)
# 	deviceName: str = ormar.String(max_length=200)
# 	field: str = ormar.String(max_length=200)
# 	type: str = ormar.String(max_length=100)
# 	value: str = ormar.String(max_length=500)
# 	unit: str = ormar.String(max_length=10, default="")
# 	datatime: str = ormar.String(max_length=20)

