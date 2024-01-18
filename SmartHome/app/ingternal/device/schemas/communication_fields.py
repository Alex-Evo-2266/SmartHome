from pydantic import BaseModel
from enum import Enum

class TypeRelatedFields(str, Enum):
	DEVICE = "device"


class RelatedFields(BaseModel):
	type: TypeRelatedFields
	system_name: str
	field: str
	

