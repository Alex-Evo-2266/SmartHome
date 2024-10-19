import ormar, datetime
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional
from app.internal.user.models.user import User
from ormar import ReferentialAction
from uuid import UUID

class Session(ormar.Model):
	ormar_config = base_ormar_config.copy(
		constraints = [ormar.UniqueColumns("access", "refresh")]
	)

	id: str = ormar.String(max_length=100, primary_key=True)
	user: Optional[User] = ormar.ForeignKey(User, ondelete=ReferentialAction.CASCADE)
	service: str = ormar.String(max_length=100, nullable=True)
	access: str = ormar.Text(max_length=500, nullable=False)
	refresh: str = ormar.Text(max_length=500, nullable=False)
	expires_at: datetime.datetime = ormar.DateTime()
	host: str = ormar.Text(max_length=200, nullable=True)

	def __str__(self):
		return self.id
