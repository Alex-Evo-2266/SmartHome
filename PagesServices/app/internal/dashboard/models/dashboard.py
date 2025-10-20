import ormar
from typing import Optional, List
from app.pkg.ormar.dbormar import base_ormar_config

# -------------------------
# Вспомогательная таблица для ManyToMany
# -------------------------

class UserDashboardLink(ormar.Model):
    ormar_config = base_ormar_config.copy(tablename="userdashboardlink")
    
    id: int = ormar.Integer(primary_key=True)


# -------------------------
# Основные модели
# -------------------------

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

    user_id: str = ormar.String(max_length=200, primary_key=True)
    # dashboards подключаем через вспомогательную модель ниже
    dashboards: Optional[List[Dashboard]] = ormar.ManyToMany(
        Dashboard,
        through=UserDashboardLink
    )

    def __str__(self):
        return self.user_id


