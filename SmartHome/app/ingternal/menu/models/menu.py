import ormar
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional
from app.ingternal.authtorization.models.user import User

class MenuElement(ormar.Model):
    ormar_config = base_ormar_config.copy()

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    icon:str = ormar.String(max_length=200, default="")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User, related_name="menu_elements")
