from pydantic import BaseModel
from typing import Optional


class MenuElementsSchema(BaseModel):
    id: Optional[int]
    title:str
    iconClass:str
    url:str
