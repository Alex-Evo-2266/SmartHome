import ormar
from app.pkg.ormar.dbormar import base_ormar_config

class Dashboard(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	user_id: str = ormar.String(max_length=200)
	data: str = ormar.Text()
	title: str = ormar.String(max_length=100)
	private: bool = ormar.Boolean(default=False)

	def __str__(self):
		return self.id

class UserDashboard(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id_dashboard: str = ormar.String(max_length=100)
	user_id: str = ormar.String(max_length=200, primary_key=True)

	def __str__(self):
		return self.id_dashboard
