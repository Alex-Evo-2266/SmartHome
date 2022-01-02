from pydantic import BaseModel
from typing import Optional, List, Dict

class CardChildren(BaseModel):
    index: Optional[int]
    name: str
    type: str
    title: Optional[str]
    order: int
    width: int
    height: int
    deviceName: Optional[str]
    typeAction: Optional[str]

class HomeCard(BaseModel):
    index: Optional[int]
    name: str
    order: int
    type: str
    children: List[CardChildren]
    width: int

class HomePage(BaseModel):
    name: str
    cards: List[HomeCard]
