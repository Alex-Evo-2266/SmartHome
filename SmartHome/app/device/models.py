import ormar, datetime
from app.dbormar import BaseMeta
from typing import Optional, List, Dict, Union
from app.device.schemas import Received_Data_Format, Status_Device, Type_device_field


class Device(ormar.Model):
	class Meta(BaseMeta):
		pass

	name: str = ormar.String(max_length=200)
	system_name: str = ormar.String(max_length=200, primary_key=True)
	class_device: str = ormar.String(max_length=200)
	type: str = ormar.String(max_length=200)
	address: Optional[str] = ormar.String(max_length=200, nullable=True)
	token: Optional[str] = ormar.String(max_length=200, nullable=True)
	type_command: Received_Data_Format = ormar.String(max_length=200, default=Received_Data_Format.JSON)
	device_polling: bool = ormar.Boolean(default=True)
	device_status: Optional[Status_Device] = Status_Device.OFFLINE
	value: Optional[Dict[str,str]] = dict()
	# type_field: Dict[str,str] = {}
	
class Device_field(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	name: str = ormar.String(max_length=200)
	address: Optional[str] = ormar.String(max_length=200, nullable=True)
	type: Type_device_field = ormar.String(max_length=200)
	low: Optional[str] = ormar.String(max_length=200, nullable=True)
	high: Optional[str] = ormar.String(max_length=200, nullable=True)
	enum_values: Optional[str] = ormar.String(max_length=200, nullable=True)
	read_only: bool = ormar.Boolean()
	icon: str = ormar.String(max_length=200, default="fas fa-circle-notch")
	unit: Optional[str] = ormar.String(max_length=200, default="")
	device: Optional[Union[Device, Dict]] = ormar.ForeignKey(Device)

class Value(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True)
	datatime: str = ormar.String(max_length=20)
	deviceName: str = ormar.String(max_length=200)
	field: Optional[Union[Device_field, Dict]] = ormar.ForeignKey(Device_field)



class DeviceHistory(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True)
	deviceName: str = ormar.String(max_length=200)
	field: str = ormar.String(max_length=200)
	type: str = ormar.String(max_length=100)
	value: str = ormar.String(max_length=500)
	unit: str = ormar.String(max_length=10, default="")
	datatime: str = ormar.String(max_length=20)
