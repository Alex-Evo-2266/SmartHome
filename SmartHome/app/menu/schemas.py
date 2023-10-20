from pydantic import BaseModel
from typing import Optional


class MenuElementsSchema(BaseModel):
    id: Optional[int]
    title:str
    iconClass:Optional[str]
    icon: str
    url:str
