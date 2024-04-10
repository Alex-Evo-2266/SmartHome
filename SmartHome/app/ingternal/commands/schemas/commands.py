from enum import Enum
from pydantic import BaseModel
from typing import List, Any, Dict, Union

class CommandSchema(BaseModel):
	command: str
	arg: List[str] = []

	class Config:
		use_enum_values = True
