from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.scripts.enums import Condition, TypeEntity, Sign, TypeEntityAction, TypeEntityCondition

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

class TriggerEntity(BaseModel):

	id: Optional[int] = None
	type_entity: TypeEntity
	entity: str

	class Config:
		use_enum_values = True

class TriggerSchema(BaseModel):
	name: str
	system_name: str
	entities: List[TriggerEntity]
	condition: Condition
	conditions: List[TriggerCondition]
	actions: List[TriggerAction]
	differently: List[TriggerAction]
	status: bool

	class Config:
		use_enum_values = True



class AddTrigger(BaseModel):
	name: str
	system_name: str
	entities: List[TriggerEntity]
	condition: Condition
	conditions: List[TriggerCondition]
	actions: List[TriggerAction]
	differently: List[TriggerAction]

	class Config:
		use_enum_values = True



class PatchStatusTrigger(BaseModel):
	status: bool

