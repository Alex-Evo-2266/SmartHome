from pydantic import BaseModel
from typing import Optional, List
from .components import Action

class MenuSubItem(BaseModel):
    label: str
    icon: Optional[str] = None
    activated: bool = False
    action: Optional[Action] = None

class MenuItem(BaseModel):
    label: str
    icon: Optional[str] = None
    activated: bool = False
    action: Optional[Action] = None
    subItems: Optional[List[MenuSubItem]] = None

class Menu(BaseModel):
    name: str
    components: List[MenuItem]
