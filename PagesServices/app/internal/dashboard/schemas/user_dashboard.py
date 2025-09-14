from pydantic import BaseModel
from typing import List, Literal, Optional
from enum import Enum

class DashboardsListUser(BaseModel):
	dashboards: List[str]