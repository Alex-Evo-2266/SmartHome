import ormar

from app.pkg.ormar.dbormar import base_ormar_config


class UserDashboard(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename="userdashboard")

    id: int = ormar.Integer(
        primary_key=True,
    )

    user_id: str = ormar.String(
        max_length=255,
        index=True,
    )

    dashboard_id: str = ormar.String(
        max_length=255,
        index=True,
    )

    title: str = ormar.String(
        max_length=255,
    )