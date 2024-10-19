from pydantic import BaseModel
from app.internal.user.models.user import User
from app.internal.role.models.role import Role
from app.internal.auth.models.auth import Session

class AuthHeaders(BaseModel):
    X_auth_token: str

class TokenData(BaseModel):
    user_id: str
    user_role: Role

class UserDepData(BaseModel):
    user: User
    role: Role

class SessionDepData(BaseModel):
    user: User
    role: Role
    session: Session