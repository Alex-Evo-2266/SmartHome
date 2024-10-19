from pydantic import BaseModel
from typing import List

class RoleForm(BaseModel):
    role_name: str

class RoleSchema(BaseModel):
    id: int
    role_name: str

class PrivilegeForm(BaseModel):
    privilege: str

class PrivilegeSchema(BaseModel):
    id: int
    privilege: str

class RoleResponseSchema(BaseModel):
    id: int
    role_name: str
    privileges: List[PrivilegeSchema]

class EditPrivilegeRoleForm(BaseModel):
    role_name: str
    privileges: List[PrivilegeForm]