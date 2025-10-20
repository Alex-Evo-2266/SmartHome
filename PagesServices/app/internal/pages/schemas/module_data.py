from pydantic import BaseModel
from typing import List

class ModuleData(BaseModel):
	name: str
	name_pages: List[str]