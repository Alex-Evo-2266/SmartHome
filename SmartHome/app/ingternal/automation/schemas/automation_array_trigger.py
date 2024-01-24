from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.automation.enums import TypeEntityTrigger, Periods, TIME_MONTH

class ArrayItemAutomationEntity(BaseModel):

	type_entity: TypeEntityTrigger
	period: Optional[Periods]
	month: Optional[TIME_MONTH]
	day: Optional[str]
	hour: Optional[str]
	minute: Optional[str]
	entity_system_name: Optional[str]
	entity_field_name: Optional[str]

	class Config:
		use_enum_values = True