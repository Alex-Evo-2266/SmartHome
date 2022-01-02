from pydantic import BaseModel
from enum import Enum
from typing import Optional, List, Dict, Any

# class TypeGroup(str, Enum):
#     OR = "or"
#     AND = "and"

# class TriggerSchema(BaseModel):
#     action: Any
#     systemName: Optional[str]
#     type: str
#
# class ValueSchema(BaseModel):
#     type: str
#     value: Optional[str]
#     action: Optional[str]
#     systemName: Optional[str]
#     value1: Optional[Any]
#     value2: Optional[Any]
#
# class ConditionSchema(BaseModel):
#     action: Optional[Any]
#     systemName: Optional[str]
#     oper: str
#     type: str
#     value: Optional[ValueSchema]
#     children: Optional[List[Any]] = None
#
# class ActionSchema(BaseModel):
#      action: Optional[Any]
#      systemName: Optional[str]
#      type: str
#      value: Optional[ValueSchema]

class ScriptSchema(BaseModel):
    name: str
    status: bool = True
    trigger: List[Any]
    condition: Any
    then: List[Any]
    otherwise: List[Any]

class StatusScriptSchema(BaseModel):
    name: str
    status: bool
