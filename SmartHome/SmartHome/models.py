import ormar
from SmartHome.dbormar import BaseMeta
from typing import Optional, List

# Create your models here.
class User(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    UserName: str = ormar.String(max_length=200, nullable=False)
    UserSurname: str = ormar.String(max_length=200, nullable=True)
    UserPassword: str = ormar.String(max_length=200, nullable=False)
    UserEmail: str = ormar.String(max_length=200, nullable=False)
    UserMobile: str = ormar.String(max_length=200, nullable=False)
    UserLevel: int = ormar.Integer(default=1)
    page: str = ormar.String(max_length=200, default="basePage")

    def __str__(self):
        return self.UserName

class Session(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    user: Optional[User] = ormar.Integer(nullable=True)
    access: str = ormar.Text(max_length=500, nullable=False)
    refrash: str = ormar.Text(max_length=500, nullable=False)
    access_oauth: str = ormar.Text(max_length=500, nullable=True)
    refrash_oauth: str = ormar.Text(max_length=500, nullable=True)

    def __str__(self):
        return self.id

class MenuElement(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User)

    def model_to_dict(self):
        return{
        "title":self.title,
        "iconClass":self.iconClass,
        "url":self.url
        }

class ImageBackground(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    type: str = ormar.String(max_length=200, default="base")
    title: str = ormar.String(max_length=200)
    image: str = ormar.String(max_length=1000)
    user: Optional[User] = ormar.ForeignKey(User, related_name="background")

class DeviceHistory(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    deviceName: str = ormar.String(max_length=200)
    field: str = ormar.String(max_length=200)
    type: str = ormar.String(max_length=100)
    value: str = ormar.String(max_length=500)
    unit: str = ormar.String(max_length=10, default="")
    datatime: str = ormar.String(max_length=20)
