from enum import Enum
from pydantic import BaseModel
from .enums import ConditionType, Operation, SetType
from typing import Optional, List, Dict

class TargetItem(BaseModel):
	service: str
	object: str
	data: str

class ConditionItem(BaseModel):
	operation: Operation
	arg1_service: str
	arg1_object: str
	arg1_data: str
	arg2_ervice: str
	arg2_object: str
	arg2_data: str
	
	class Config:  
		use_enum_values = True

class ActionItem(BaseModel):
	service: str
	object: str
	data: str
	set: str
	type_set: SetType

	class Config:  
		use_enum_values = True

class Automation(BaseModel):
	name:str
	target:List[TargetItem]
	condition: List[ConditionItem]
	condition_type: ConditionType
	then: List[ActionItem]
	else_branch: List[ActionItem]
	

	class Config:  
		use_enum_values = True


