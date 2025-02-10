from enum import Enum
from pydantic import BaseModel
from .enums import ConditionType, Operation, SetType
from typing import Optional, List, Dict

class TriggerItemSchema(BaseModel):
	service: str
	object: str
	data: str

class ConditionItemSchema(BaseModel):
	operation: Operation
	arg1_service: str
	arg1_object: str
	arg1_data: str
	arg2_service: str
	arg2_object: str
	arg2_data: str
	
	class Config:  
		use_enum_values = True

class ActionItemSchema(BaseModel):
	service: str
	object: str
	field: str
	data: str
	type_set: SetType

	class Config:  
		use_enum_values = True

class AutomationSchema(BaseModel):
	name:str
	trigger:List[TriggerItemSchema]
	condition: List[ConditionItemSchema]
	condition_type: ConditionType
	then: List[ActionItemSchema]
	else_branch: List[ActionItemSchema]
	is_enabled: bool = True
	

	class Config:  
		use_enum_values = True


class EnableSchema(BaseModel):
	is_enabled: bool = True
	