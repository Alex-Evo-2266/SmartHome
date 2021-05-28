from django.contrib import admin
from .models import User,UserConfig
from .models import Room,Device
from .models import ConfigDevice,ValueDevice,ValueListDevice
from .models import HomePage,HomeCart,CartChildren,MenuElement

# Register your models here.
admin.site.register(User)
# admin.site.register(ImageBackground)
admin.site.register(UserConfig)
admin.site.register(Room)
admin.site.register(Device)
admin.site.register(ConfigDevice)
admin.site.register(ValueDevice)
admin.site.register(ValueListDevice)
admin.site.register(HomePage)
admin.site.register(HomeCart)
admin.site.register(CartChildren)
admin.site.register(MenuElement)
