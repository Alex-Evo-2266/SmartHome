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
    path('devices/add',views.deviceAdd),
    # path('devices/all',views.devicesGive),
    path('devices/get/<int:id>',views.deviceGive),
    path('devices/edit',views.deviceEdit),
    path('devices/delete',views.deviceDelete),
    path('devices/value/set',views.deviceSetValue),
    # path('media/set/<slug:name>/', views.media)
    # path('devices/all',views.allDevices),
    # path('base/fonImage',views.fonImage),
]
# /api/media/set/
