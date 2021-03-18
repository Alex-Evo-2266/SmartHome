from django.contrib import admin
from .models import MovieCategory, MovieActor, MovieGanre, Movie, MovieShots, RatingStar,Rating

admin.site.register(MovieCategory)
admin.site.register(MovieActor)
admin.site.register(MovieGanre)
admin.site.register(Movie)
admin.site.register(MovieShots)
admin.site.register(RatingStar)
admin.site.register(Rating)

# Register your models here.
