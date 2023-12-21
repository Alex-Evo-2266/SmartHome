from pydantic import BaseModel
from typing import Optional, List

from app.device.device_class.schemas import AdditionDevice, ChangeDevice
from app.device.type_class.schema import TypeDevice

class OptionsDevice(BaseModel):
	class_name: str
	class_img_url: Optional[str] = None
	added: AdditionDevice
	added_url: Optional[str] = None
	change_url: Optional[str] = None
	change: ChangeDevice
	types: List[TypeDevice] = []