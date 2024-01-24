from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.automation.enums import Condition, TypeEntityTrigger, Sign, TypeEntityAction, TypeEntityCondition, Periods, TIME_MONTH
from app.ingternal.automation.schemas.automation_array_trigger import ArrayItemAutomationEntity
from app.ingternal.automation.schemas.automation_array_condition import ArrayItemAutomationCondition
from app.ingternal.automation.schemas.automation_array_action import ArrayItemAutomationAction

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

class AutomationArrayItem(BaseModel):
	name: str
	system_name: str
	entities: List[ArrayItemAutomationEntity]
	condition: Condition
	conditions: List[ArrayItemAutomationCondition]
	actions: List[ArrayItemAutomationAction]
	differently: List[ArrayItemAutomationAction]
	status: bool

	class Config:
		use_enum_values = True

class AutomationTimeItem(BaseModel):
	entity: List[ArrayItemAutomationEntity]
	automation_name: str

	class Config:
		use_enum_values = True

