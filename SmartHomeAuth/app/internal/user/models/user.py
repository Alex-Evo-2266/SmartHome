from enum import Enum
import ormar, datetime
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import metadata, database, base_ormar_config
from typing import Optional, List


class Role(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: int = ormar.Integer(primary_key=True)
	role_name: str = ormar.String(max_length=100, nullable=False)
	
class RolePrivilege(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: int = ormar.Integer(primary_key=True)
	role: Optional[Role] = ormar.ForeignKey(Role, related_name="privileges", ondelete=ReferentialAction.CASCADE)
	privilege: str = ormar.String(max_length=200, default="")

class User(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("name")]
	)

	id: int = ormar.Integer(primary_key=True)
	name: str = ormar.String(max_length=100, nullable=False)
	email: str = ormar.String(max_length=200, default="")
	password: str = ormar.String(max_length=400, nullable=False)
	role: Optional[Role] = ormar.ForeignKey(Role, related_name="users", ondelete=ReferentialAction.RESTRICT)

