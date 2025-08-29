from pydantic import BaseModel
from typing import List

class RoleForm(BaseModel):
    role_name: str

class RoleSchema(BaseModel):
    id: str
    role_name: str

class PrivilegeForm(BaseModel):
    privilege: str

class PrivilegeSchema(BaseModel):
    id: str
    privilege: str

class RoleResponseSchema(BaseModel):
    id: str
    role_name: str
    privileges: List[PrivilegeSchema]

class RoleResponseSchemaList(BaseModel):
    roles: List[RoleResponseSchema]

class EditPrivilegeRoleForm(BaseModel):
    role_name: str
    privileges: List[PrivilegeForm]

class PrivilegeSchemaList(BaseModel):
    privileges: List[PrivilegeSchema]