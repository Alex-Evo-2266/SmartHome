from pydantic import BaseModel

class MessageSchemas(BaseModel):
	message: str
	email: str
	subject: str
