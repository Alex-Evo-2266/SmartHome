from pydantic import BaseModel
from enum import Enum
from typing import Callable, Optional

class ConfigItemType(str, Enum):
	NUMBER = "number"
	TEXT = "text"
	PASSWORD = "password"

class ConfigItem(BaseModel):
	class Config:  
		use_enum_values = True

	key: str
	value: str
	type: ConfigItemType
	tag: str = 'base'

def foo():
	pass

class DependFunction(BaseModel):
	get: Optional[Callable] = None
	patch: Optional[Callable] = None
	
class ConfigRouterOption(BaseModel):
	prefix:str = '/api-config'
	tag: str = 'config'
	depend_function: Optional[Callable] = foo
	depend_functions: Optional[DependFunction] = DependFunction()