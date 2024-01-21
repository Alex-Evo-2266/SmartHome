from pydantic import BaseModel
from typing import Optional, List, Dict, Union
from app.ingternal.scripts.enums import TypeEntityAction, TIME_MONTH, Sign

class ArrayItemTriggerAction(BaseModel):

	type_entity: TypeEntityAction
	entity_system_name: Optional[str]
	entity_field_name: Optional[str]
	value: str

	class Config:
		use_enum_values = True
