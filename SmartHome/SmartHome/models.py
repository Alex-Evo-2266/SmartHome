import ormar
from SmartHome.dbtest import BaseMeta
from typing import Optional, List

class LocalImage(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title: str = ormar.String(max_length=200, nullable=False)
    image: str = ormar.String(max_length=200, nullable=False)

    def __str__(self):
        return self.title

class ImageBackground(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    type: str = ormar.String(max_length=200, default="base")
    image: Optional[LocalImage] = ormar.ForeignKey(LocalImage, nullable=True)

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
    Style: str = ormar.String(max_length=200, default="light")
    auteStyle: bool = ormar.Boolean(default=True)
    staticBackground: bool = ormar.Boolean(default=False)
    background: Optional[List[ImageBackground]] = ormar.ManyToMany(ImageBackground)
    page: str = ormar.String(max_length=200, default="basePage")

    def __str__(self):
        return self.UserName

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