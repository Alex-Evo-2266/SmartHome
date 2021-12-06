from django.contrib import admin
from .models import User,UserConfig
from .models import MenuElement

# Register your models here.
admin.site.register(User)
# admin.site.register(ImageBackground)
admin.site.register(UserConfig)
admin.site.register(MenuElement)
