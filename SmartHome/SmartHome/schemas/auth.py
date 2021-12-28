from pydantic import BaseModel

class Login(BaseModel):
    name: str
    password: str
