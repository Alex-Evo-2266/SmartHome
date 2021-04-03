from django.contrib import admin
from .models import MovieCategory, MovieActor, MovieGanre,Movie,Serial,MovieShots
from django.utils.html import mark_safe

@admin.register(MovieCategory)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id","name","url")
    list_display_links = ("name",)

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ("title","category","url","loaded","get_image")
    list_display_links = ("title",)
    list_filter = ("category","year")
    search_fields = ("title","category__name")
    save_on_top = True
    save_as = True
    list_editable = ("loaded",)
    readonly_fields = ("get_image",)

    def get_image(self,obj):
        return mark_safe(f'<img src={obj.poster.url} width="50" height="70"')

    get_image.short_description = "Изображение"

@admin.register(MovieActor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ("name","date_of_birth","get_image")
    readonly_fields = ("get_image",)

    def get_image(self,obj):
        return mark_safe(f'<img src={obj.image.url} width="40" height="60"')

    get_image.short_description = "Изображение"

admin.site.register(MovieGanre)
admin.site.register(Serial)
admin.site.register(MovieShots)



# Register your models here.
