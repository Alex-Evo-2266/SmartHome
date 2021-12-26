from pydantic import BaseModel

class UserForm(BaseModel):
    name: str
    password: str
    email: str
    mobile: str

class Message(BaseModel):
    message: str
