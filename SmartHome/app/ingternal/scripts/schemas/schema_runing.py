from enum import Enum
from pydantic import BaseModel
from typing import List, Any, Dict, Union

class ConditionType(str, Enum):
	AND = "and"
	OR = "or"

class ScriptConditionBlock(BaseModel):
	type: ConditionType
	commands: List[Any]

	class Config:
		use_enum_values = True


class ScriptCommandBlock(BaseModel):
	command: str
	arg: List[str]

	class Config:
		use_enum_values = True

