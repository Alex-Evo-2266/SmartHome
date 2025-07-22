from pydantic import BaseModel

class QueueItem(BaseModel):
    type: str

    class Config:
        use_enum_values = True
