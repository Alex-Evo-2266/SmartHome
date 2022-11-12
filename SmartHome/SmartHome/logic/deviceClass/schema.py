from typing import List
from pydantic import BaseModel

class ChangeField(BaseModel):
	added:bool = True
	deleted:bool = True
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

class OptionalDevice(BaseModel):
	class_name: str
	added: AdditionDevice
	change: ChangeDevice