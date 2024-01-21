from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.scripts.enums import TypeEntity, Periods, TIME_MONTH

class ArrayItemTriggerEntity(BaseModel):

	type_entity: TypeEntity
	period: Optional[Periods]
	month: Optional[TIME_MONTH]
	day: Optional[str]
	hour: Optional[str]
	minute: Optional[str]
	entity_system_name: Optional[str]
	entity_field_name: Optional[str]

	class Config:
		use_enum_values = True