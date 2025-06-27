import ormar
from app.pkg.ormar.dbormar import base_ormar_config

class Room(ormar.Model):
	ormar_config = base_ormar_config.copy()

	name: str = ormar.String(max_length=200, primary_key=True)
	poligon: str = ormar.String(max_length=500, default="")

