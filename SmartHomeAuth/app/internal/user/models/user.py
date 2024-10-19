import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional
from uuid import UUID

from app.internal.role.models.role import Role

class User(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("name")]
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	name: str = ormar.String(max_length=100, nullable=False)
	email: str = ormar.String(max_length=200, default="")
	password: str = ormar.String(max_length=400, nullable=False)
	role: Optional[Role] = ormar.ForeignKey(Role, related_name="users", ondelete=ReferentialAction.RESTRICT)

