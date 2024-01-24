from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.automation.enums import TypeEntityAction, TIME_MONTH, Sign

class ArrayItemAutomationAction(BaseModel):

	type_entity: TypeEntityAction
	entity_system_name: Optional[str]
	entity_field_name: Optional[str]
	value: str

	class Config:
		use_enum_values = True
