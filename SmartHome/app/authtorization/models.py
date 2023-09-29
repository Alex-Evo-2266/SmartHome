from enum import Enum
import ormar, datetime
from app.authtorization.schema import AuthType, UserLevel
from app.dbormar import BaseMeta
from typing import Optional, List

class User(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("name")]

	id: int = ormar.Integer(primary_key=True)
	name: str = ormar.String(max_length=100, nullable=False)
	email: str = ormar.String(max_length=200, default="")
	auth_service_name: str = ormar.String(max_length=400, nullable=True)
	auth_service_id: int = ormar.Integer(nullable=True)
	auth_type: AuthType = ormar.String(max_length=50, nullable=False)
	password: str = ormar.String(max_length=400, nullable=True)
	role: UserLevel = ormar.String(max_length=10, default=UserLevel.NONE)


class Session(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("access", "refresh")]

	id: int = ormar.Integer(primary_key=True)
	user: Optional[User] = ormar.ForeignKey(User)
	auth_type: AuthType = ormar.String(max_length=50, nullable=False)
	access: str = ormar.Text(max_length=500, nullable=False)
	refresh: str = ormar.Text(max_length=500, nullable=False)
	access_oauth: str = ormar.Text(max_length=500, nullable=True)
	refresh_oauth: str = ormar.Text(max_length=500, nullable=True)
	expires_at: datetime.datetime = ormar.DateTime()
	oauth_host: str = ormar.Text(max_length=200, nullable=True)

	def __str__(self):
		return self.id

class MenuElement(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    icon:str = ormar.String(max_length=200, default="")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User, related_name="menu_elements")
