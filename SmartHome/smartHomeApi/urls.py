from django.urls import path,re_path
from . import views

urlpatterns = [
    path('auth/register',views.register),
    path('auth/login',views.login),
    path('server/config',views.clientConfig),
    path('server/config/edit',views.clientConfigedit),
    path('server/usersConfig/edit',views.editUsersConf),
    path('server/usersConfig',views.giveUserConf),
    path('user/config/style/edit',views.edituserconfstyle),
    path('user',views.giveuser),
    path('user/edit',views.edituser),
    # path('media/set/<slug:name>/', views.media)
    # path('devices/all',views.allDevices),
    # path('base/fonImage',views.fonImage),
]
# /api/media/set/
