import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional
from uuid import UUID


class Role(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("role_name")]
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	role_name: str = ormar.String(max_length=100, nullable=False)
	
class RolePrivilege(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("privilege")]
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	role: Optional[Role] = ormar.ForeignKey(Role, related_name="privileges", ondelete=ReferentialAction.CASCADE)
	privilege: str = ormar.String(max_length=200, default="")