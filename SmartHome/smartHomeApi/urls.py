from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('auth/register',views.register),
    path('auth/login',views.login),
    path('server/config',views.clientConfig),
    path('devices/all',views.allDevices),
    path('base/fonImage',views.fonImage),
]
