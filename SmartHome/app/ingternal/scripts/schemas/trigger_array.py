from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.scripts.enums import Condition, TypeEntity, Sign, TypeEntityAction, TypeEntityCondition, Periods, TIME_MONTH
from app.ingternal.scripts.schemas.trigger_array_trigger import ArrayItemTriggerEntity
from app.ingternal.scripts.schemas.trigger_array_condition import ArrayItemTriggerCondition
from app.ingternal.scripts.schemas.trigger_array_action import ArrayItemTriggerAction

class TriggerCondition(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntityCondition
	entity: str
	sign: Sign = Sign.EQUALLY
	value: str

	class Config:
		use_enum_values = True

class TriggerAction(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntityAction
	entity: str
	value: str

	class Config:
		use_enum_values = True

class TriggerArrayItem(BaseModel):
	name: str
	system_name: str
	entities: List[ArrayItemTriggerEntity]
	condition: Condition
	conditions: List[ArrayItemTriggerCondition]
	actions: List[ArrayItemTriggerAction]
	differently: List[ArrayItemTriggerAction]
	status: bool

	class Config:
		use_enum_values = True

class TriggerTimeItem(BaseModel):
	entity: List[ArrayItemTriggerEntity]
	trigger_name: str

	class Config:
		use_enum_values = True

