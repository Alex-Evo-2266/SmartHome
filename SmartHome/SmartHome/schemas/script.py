from pydantic import BaseModel
from enum import Enum
from typing import Optional, List, Dict, Any

class TypeBlock(str, Enum):
	CNODITION = "condition"
	ACTION = "action"

class TypeObject(str, Enum):
	DEVICE = "device"

class TypeValue(str, Enum):
	SELECT = "select"
	TEXT = "text"
	NUMBER = "number"
	DEVICE = "device"
	MATH = "math"
	ROUND = "round"

class TriggerElementSchema(BaseModel):
	arg1: str
	arg2: str

	class Config:  
		use_enum_values = True

class TriggerSchema(BaseModel):
	trigger:List[TriggerElementSchema]
	next:List[int]

	class Config:  
		use_enum_values = True

class Value(BaseModel):
	arg1: Optional[str | Any]
	arg2: Optional[str | Any]
	operator: str
	type: TypeValue

	class Config:  
		use_enum_values = True

class BlockSchema(BaseModel):
	x: int
	y: int
	id: int
	type: TypeBlock
	type_object: TypeObject
	next: Dict[str, List[int]]
	arg1: str
	arg2: str
	operator: str
	value: Value

	class Config:  
		use_enum_values = True

class ScriptStatus(str, Enum):
	AUTO = "auto"
	MANUAL = "manual"

class ScriptSchema(BaseModel):
	name: str
	trigger: TriggerSchema
	blocks: List[BlockSchema]
	status: Optional[ScriptStatus]

	class Config:  
		use_enum_values = True
