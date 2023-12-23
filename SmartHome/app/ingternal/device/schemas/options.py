from pydantic import BaseModel
from typing import Optional, List

from app.ingternal.device.schemas.device_class import AdditionDevice, ChangeDevice
from app.ingternal.device.schemas.type import TypeDevice

class OptionsDevice(BaseModel):
	class_name: str
	class_img_url: Optional[str] = None
	added: AdditionDevice
	added_url: Optional[str] = None
	change_url: Optional[str] = None
	change: ChangeDevice
	types: List[TypeDevice] = []