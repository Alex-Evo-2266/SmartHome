from django.contrib import admin
from .models import User,UserConfig
from .models import Room,Device
from .models import ValueDevice,ValueListDevice
from .models import MenuElement

# Register your models here.
admin.site.register(User)
# admin.site.register(ImageBackground)
admin.site.register(UserConfig)
admin.site.register(Room)
admin.site.register(Device)
admin.site.register(ValueDevice)
admin.site.register(ValueListDevice)
admin.site.register(MenuElement)
