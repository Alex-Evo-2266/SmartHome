from typing import List, Optional
from pydantic import BaseModel
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField

class ChangeField(BaseModel):
	added:bool = True
	deleted:bool = True
	name:bool = True
	address:bool = True
	control:bool = True
	high:bool = True
	low:bool = True
	icon:bool = True
	type:bool = True
	unit:bool = True
	enum_values:bool = True
	value:bool = False

class ChangeDevice(BaseModel):
	fields:ChangeField = ChangeField()
	address:bool = True
	token:bool = False

class AdditionDevice(BaseModel):
	fields:bool = True
	address:bool = True
	token:bool = False

class ConsctionStatusForm(BaseModel):
	status: bool

class OptionalDevice(BaseModel):
	class_name: str
	added: AdditionDevice
	added_url: Optional[str] = None
	change_url: Optional[str] = None
	change: ChangeDevice
	types: List[str] = ["base"]


class FieldTypeDevice(BaseModel):
	name: str
	type: TypeField

class TypeDevice(BaseModel):
	name: str
	fields: List[FieldTypeDevice] = []