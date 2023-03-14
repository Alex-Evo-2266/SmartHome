import ormar, datetime
from SmartHome.dbormar import BaseMeta
from typing import Optional, List
from authtorization.models import User

class MenuElement(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User, related_name="menu_elements")

class DeviceHistory(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    deviceName: str = ormar.String(max_length=200)
    field: str = ormar.String(max_length=200)
    type: str = ormar.String(max_length=100)
    value: str = ormar.String(max_length=500)
    unit: str = ormar.String(max_length=10, default="")
    datatime: str = ormar.String(max_length=20)
