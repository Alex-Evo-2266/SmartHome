from email.policy import default
from enum import Enum
import ormar, datetime
from authtorization.schema import UserLevel
from SmartHome.dbormar import BaseMeta
from typing import Optional, List

class AuthType(str, Enum):
	AUTH_SERVICE = "auth_service",
	LOGIN = "login"

class User(ormar.Model):
	class Meta(BaseMeta):
		constraints = [ormar.UniqueColumns("name")]

	id: int = ormar.Integer(primary_key=True)
	name: str = ormar.String(max_length=100, nullable=False)
	email: str = ormar.String(max_length=200, default="")
	auth_service_name: str = ormar.String(max_length=400, nullable=True)
	auth_type: AuthType = ormar.String(max_length=50, nullable=False)
	password: str = ormar.String(max_length=400, nullable=True)
	role: UserLevel = ormar.String(max_length=10, default=UserLevel.BASE)


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