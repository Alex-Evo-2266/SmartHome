from pydantic import BaseModel
from typing import Optional

class RoleForm(BaseModel):
    role_name: str

class RoleSchema(BaseModel):
    id: int
    role_name: str