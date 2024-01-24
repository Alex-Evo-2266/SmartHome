from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.automation.enums import TypeEntityCondition, TIME_MONTH, Sign

class ArrayItemAutomationCondition(BaseModel):
	type_entity: TypeEntityCondition
	entity_system_name: Optional[str]
	entity_field_name: Optional[str]
	sign: Optional[Sign]
	value: Optional[str]
	month: Optional[TIME_MONTH] = None
	day: Optional[str] = None
	hour: Optional[str] = None
	minute: Optional[str] = None

	class Config:
		use_enum_values = True