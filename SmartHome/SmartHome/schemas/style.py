from pydantic import BaseModel
from typing import Optional, List

class StyleSchemas(BaseModel):
    name: str
    active: str
    c1: str
    c2: str
    icon: Optional[str]
    ok: str
    error: str

class StyleDeleteSchemas(BaseModel):
    name: str
