from enum import Enum
from pydantic import BaseModel
from typing import List, Any, Dict, Union

class ScriptBlockType(str, Enum):
	ACTION = "action"
	CONDITION = "condition"

# class ScriptBlock(BaseModel):
# 	pass

class ScriptBlock(BaseModel):
	type: ScriptBlockType
	command: str
	branch1: List[Union[Dict, Any]] = []
	branch2: List[Union[Dict, Any]] = []

	class Config:
		use_enum_values = True

class Script(BaseModel):
	blocks: List[ScriptBlock]
	system_name: str
	name: str

	class Config:
		use_enum_values = True

