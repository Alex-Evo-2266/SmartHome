from pydantic import BaseModel
from enum import Enum
from typing import Type, TypeVar, List, Optional, Any
import logging

logger = logging.getLogger(__name__)

class TypeRespons(str, Enum):
    OK = "ok"
    ERROR = "error"
    INVALID = "invalid"
    NOT_FOUND = "NOT_FOUND"

class FunctionRespons(BaseModel):
    status: TypeRespons
    data: Any = ""
    detail: str = ""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.status == TypeRespons.ERROR:
            logger.warning(self.detail)
        if self.status == TypeRespons.INVALID:
            logger.info(self.detail)