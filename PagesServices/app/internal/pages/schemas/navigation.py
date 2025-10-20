from pydantic import BaseModel
from typing import List, Optional

class Navigation(BaseModel):
    path: str
    file: str
    host: str
    full_path: str
    type: str
    name: str
    service: str
    page_name: str

class NavigationData(BaseModel):
    pages: List[Navigation]
    prefix: str