from pydantic import BaseModel
from typing import List, Literal, Optional
from enum import Enum

class ControlElementType(str, Enum):
	BOOL = "bool"
	NUMBER = "number"
	TEXT = "text"
	Enum = "enum"

class ControlElement(BaseModel):
	type: ControlElementType
	data: str
	title: str
	readonly: bool
	width: Literal[1, 2, 3, 4]

class DashboardCard(BaseModel):
	title: str
	id: str
	type: str
	data: Optional[str] = None
	items: Optional[List[ControlElement]]

class Dashboard(BaseModel):
	title: str
	id: str
	private: bool = False
	cards: List[DashboardCard]

class DashboardsData(BaseModel):
	dashboards: List[Dashboard]

class DashboardOut(Dashboard):
	pass

class DashboardIn(Dashboard):
	pass