import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional, List

class Privilege(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("privilege")],
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	privilege: str = ormar.String(max_length=200, default="")

class Role(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("role_name")]
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	role_name: str = ormar.String(max_length=100, nullable=False)
	privileges: Optional[List[Privilege]] = ormar.ManyToMany(Privilege)
	
