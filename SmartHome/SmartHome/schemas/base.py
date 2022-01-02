from pydantic import BaseModel
from enum import Enum
from typing import Type, TypeVar, List, Optional, Any

class TypeRespons(str, Enum):
    OK = "ok"
    ERROR = "error"
    INVALID = "invalid"

class FunctionRespons(BaseModel):
    status: TypeRespons
    data: Optional[Any]
    detail: Optional[str]
