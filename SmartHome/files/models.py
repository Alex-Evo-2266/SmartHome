from django.db import models
from datetime import date

class MovieCategory(models.Model):
    """категории"""
    name = models.CharField("Категория",max_length=150)
    discription = models.TextField("Описание")
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"


class MovieActor(models.Model):
    """актеры и режиссеры"""
    name = models.CharField("Категория",max_length=150)
    age = models.PositiveSmallIntegerField("Возраст")
    discription = models.TextField("Описание")
    image = models.ImageField("Изображение",upload_to="files/movie/actors/")
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Актеры и режиссеры"
        verbose_name_plural = "Актеры и режиссеры"


class MovieGanre(models.Model):
    """жанры"""
    name = models.CharField("Имя",max_length=150)
    discription = models.TextField("Описание")
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Жанр"
        verbose_name_plural = "Жанры"

class Movie(models.Model):
    """фильмы"""
    title = models.CharField("Название",max_length=150)
    tagline = models.CharField("Слоган",max_length=150, default="")
    discription = models.TextField("Описание")
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
    url = models.SlugField(max_length=160, unique=True)
    localUrl = models.SlugField(max_length=160, default="",unique=True)
    status = models.CharField("Статус",max_length=150, default="")
    draft = models.BooleanField("черновик",default=False)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Фильм"
        verbose_name_plural = "Фильмы"

class MovieShots(models.Model):
    """кадры"""
    title = models.CharField("Заголовок",max_length=150)
    discription = models.TextField("Описание")
    image = models.ImageField("Изображение",upload_to="files/movie/shots/")
    movie = models.ForeignKey(Movie, verbose_name="фильм", on_delete=models.CASCADE)
    url = models.SlugField(max_length=160, unique=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "кадр из фильма"
        verbose_name_plural = "кадры из фильма"

class RatingStar(models.Model):
    """звезда рейтинга"""
    value = models.SmallIntegerField()

    def __str__(self):
        return self.value

    class Meta:
        verbose_name = "Звезда рейтинга"
        verbose_name_plural = "Звезды рейтинга"

class Rating(models.Model):
    """звезда рейтинга"""
    ip = models.CharField("Ip адрес", max_length=15)
    star = models.ForeignKey(RatingStar, on_delete=models.CASCADE, verbose_name="звезда")
    movie = models.ForeignKey(Movie, on_delete=models.CharField, verbose_name="фильм")

    def __str__(self):
        return f"{self.star} - {self.movie}"

    class Meta:
        verbose_name = "Рейтинг"
        verbose_name_plural = "Рейтинги"
