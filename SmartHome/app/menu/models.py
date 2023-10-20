from enum import Enum
import ormar, datetime
from app.authtorization.schema import AuthType, UserLevel
from app.dbormar import BaseMeta
from typing import Optional, List
from app.authtorization.models import User

class MenuElement(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    icon:str = ormar.String(max_length=200, default="")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User, related_name="menu_elements")
