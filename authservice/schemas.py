from pydantic import BaseModel

class LoginForm(BaseModel):
    """docstring for LoginForm."""
    login: str
    password: str

class UserForm(BaseModel):
    """docstring for UserForm."""
    name: str
    surname: str
    login: str
    poassword: str
