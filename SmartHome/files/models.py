from django.db import models
import datetime
from .logic.transform import set_to_list_dict
from datetime import date, timedelta

class MovieCategory(models.Model):
    """категории"""
    name = models.CharField("Категория",max_length=150)
    discription = models.TextField("Описание",default="")
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.name

    def model_to_dict(self):
        return{
        "name":self.name,
        "discription":self.discription,
        "url":self.url
        }

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class MovieActor(models.Model):
    """актеры и режиссеры"""
    name = models.CharField("Имя",max_length=150)
    date_of_birth = models.DateField("дата рождения", default=datetime.date(1999,1,1))
    discription = models.TextField("Описание",default="")
    image = models.ImageField("Изображение",upload_to="files/movie/actors/")
    url = models.SlugField(max_length=160, unique=True, null=True, default=None)

    def __str__(self):
        return self.name

    def model_to_dict(self):
        return{
        "name":self.name,
        "date_of_birth":str(self.date_of_birth),
        "age":(date.today() - self.date_of_birth) // timedelta(days=365.2425),
        "discription":self.discription,
        "image":self.image.url,
        "url":self.url
        }

    class Meta:
        verbose_name = "Актеры и режиссеры"
        verbose_name_plural = "Актеры и режиссеры"


class MovieGanre(models.Model):
    """жанры"""
    name = models.CharField("Название",max_length=150)
    discription = models.TextField("Описание",default="")
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.name

    def model_to_dict(self):
        return{
        "name":self.name,
        "discription":self.discription,
        "url":self.url
        }

    class Meta:
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"

class Movie(models.Model):
    """фильмы"""
    title = models.CharField("Название",max_length=150)
    tagline = models.CharField("Слоган",max_length=150, default="")
    discription = models.TextField("Описание",default="")
    poster = models.ImageField("Постер",upload_to="files/movie/posters/")
    year = models.PositiveSmallIntegerField("Дата выхода", default=2019)
    country = models.CharField("Страна",max_length=30)
    directors = models.ManyToManyField(MovieActor, verbose_name="режиссер", related_name="film_director")
    actors = models.ManyToManyField(MovieActor, verbose_name="актеры", related_name="film_actor")
    genres = models.ManyToManyField(MovieGanre, verbose_name="Жанры")
    world_premiere = models.DateField("примьера в мире", default=date.today)
    budget = models.PositiveIntegerField("Бюджет", default=0, help_text="указать сумму в доллорах")
    fees_in_usa = models.PositiveIntegerField("сборы в США", default=0, help_text="указать сумму в доллорах")
    fees_in_world = models.PositiveIntegerField("сборы в мире", default=0, help_text="указать сумму в доллорах")
    category = models.ForeignKey(MovieCategory, verbose_name="Категория", on_delete=models.SET_NULL, null=True)
    url = models.SlugField(max_length=160, unique=True, default=None, null=True)
    localUrl = models.SlugField(max_length=160, default=None,unique=True, null=True)
    grade = models.CharField("качество",max_length=150, default="")
    loaded = models.BooleanField("загруженно",default=False)
    draft = models.BooleanField("черновик",default=False)

    def __str__(self):
        return self.title

    def model_to_dict(self):
        return {
        "title":self.title,
        "tagline":self.tagline,
        "discription":self.discription,
        "poster":self.poster.url,
        "year":self.year,
        "country":self.country,
        "directors":set_to_list_dict(self.directors.all()),
        "actors":set_to_list_dict(self.actors.all()),
        "genres":set_to_list_dict(self.genres.all()),
        "world_premiere":str(self.world_premiere),
        "budget":self.budget,
        "fees_in_usa":self.fees_in_usa,
        "fees_in_world":self.fees_in_world,
        "category":self.category.model_to_dict(),
        "url":self.url,
        "localUrl":self.localUrl,
        "grade":self.grade,
        "loaded":self.loaded,
        "draft":self.draft
        }

    class Meta:
        verbose_name = "Фильм"
        verbose_name_plural = "Фильмы"

class Serial(Movie):
    """сериалы"""
    count_seasons = models.PositiveSmallIntegerField("количество сезонов", default=1)
    closed = models.BooleanField("закрыт",default=False)
    save_seasons = models.PositiveSmallIntegerField("сохранено сезонов", default=0)

    def model_to_dict(self):
        return {
        **Movie.model_to_dict(self),
        "count_seasons":self.count_seasons,
        "closed":self.closed,
        "save_seasons":self.save_seasons
        }

    class Meta:
        verbose_name = "Сериал"
        verbose_name_plural = "Сериалы"



class MovieShots(models.Model):
    """кадры"""
    title = models.CharField("Заголовок",max_length=150)
    discription = models.TextField("Описание",default="")
    image = models.ImageField("Изображение",upload_to="files/movie/shots/")
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE)
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "кадр из фильма"
        verbose_name_plural = "кадры из фильма"
