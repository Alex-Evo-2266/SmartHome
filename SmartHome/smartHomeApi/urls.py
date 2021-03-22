from django.urls import path,re_path
from . import views

urlpatterns = [
    path('auth/register',views.register),
    path('auth/login',views.login),
    path('server/config',views.serverConfig),
    path('server/config/edit',views.clientConfigedit),
    path('server/usersConfig/edit',views.editUsersConf),
    path('server/usersConfig',views.giveUserConf),
    path('user/config/edit',views.edituserconf),
    path('user/config',views.clientConfig),
    path('user',views.giveuser),
    path('user/edit',views.edituser),
    path('user/menu/edit',views.editmenu),
    path('users/get',views.giveusers),
    path('user/add',views.addNewUser),
    path('devices/add',views.deviceAdd),
    # path('devices/all',views.devicesGive),
    path('devices/get/<int:id>',views.deviceGive),
    path('devices/edit',views.deviceEdit),
    path('devices/delete',views.deviceDelete),
    path('devices/value/set',views.deviceSetValue),
    path('homeCart/get/<int:id>',views.getHomeCart),
    path('homeCart/set',views.setHomeCart),
    # path('home/value/set',views.deviceSetValue),
    # path('media/set/<slug:name>/', views.media)
    # path('devices/all',views.allDevices),
    # path('base/fonImage',views.fonImage),
    path('media/set/background/<str:name>',views.setBackground),
]
# /api/media/set/
