import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional, Dict, Union
from app.ingternal.device.models.device import Device

class Room(ormar.Model):
	ormar_config = base_ormar_config.copy()

	name: str = ormar.String(max_length=200, primary_key=True)
	poligon: str = ormar.String(max_length=500, default="")


class Room_Device(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	device: Optional[Device] = ormar.ForeignKey(Device, related_name="room_role", ondelete=ReferentialAction.CASCADE)
	room: Optional[Room] = ormar.ForeignKey(Room, related_name="device_role", ondelete=ReferentialAction.CASCADE)
	poz: str = ormar.String(max_length=100, nullable=True, default=None)