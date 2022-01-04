from pydantic import BaseModel
from typing import Optional, List, Dict

class ImageSchema(BaseModel):
    image: str
    title: str
