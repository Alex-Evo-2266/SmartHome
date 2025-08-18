from enum import Enum
from pydantic import BaseModel
from .enums import ConditionType, Operation, SetType
from typing import Optional, List, Dict

class TriggerItemSchema(BaseModel):
	service: str
	trigger: str
	option: Optional[str] = ""

class ConditionItemSchema(BaseModel):
	operation: Operation
	arg1_service: str
	arg1: str
	arg2_service: str
	arg2: str
	
	class Config:  
		use_enum_values = True

class ActionItemSchema(BaseModel):
	service: str
	action: str
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

class AutomationResponseSchema(BaseModel):
	data: List[AutomationSchema]

class EnableSchema(BaseModel):
	is_enabled: bool = True
	