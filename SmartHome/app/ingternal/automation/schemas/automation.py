from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.automation.enums import Condition, TypeEntityTrigger, Sign, TypeEntityAction, TypeEntityCondition

class AutomationCondition(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntityCondition
	entity: str
	sign: Sign = Sign.EQUALLY
	value: str

	class Config:
		use_enum_values = True

class AutomationAction(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntityAction
	entity: str
	value: str

	class Config:
		use_enum_values = True

class AutomationTrigger(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntityTrigger
	entity: str

	class Config:
		use_enum_values = True

class AutomationSchema(BaseModel):
	name: str
	system_name: str
	triggers: List[AutomationTrigger]
	condition: Condition
	conditions: List[AutomationCondition]
	actions: List[AutomationAction]
	differently: List[AutomationAction]
	status: bool

	class Config:
		use_enum_values = True



class AddAutomation(BaseModel):
	name: str
	system_name: str
	triggers: List[AutomationTrigger]
	condition: Condition
	conditions: List[AutomationCondition]
	actions: List[AutomationAction]
	differently: List[AutomationAction]

	class Config:
		use_enum_values = True



class PatchStatusTrigger(BaseModel):
	status: bool

