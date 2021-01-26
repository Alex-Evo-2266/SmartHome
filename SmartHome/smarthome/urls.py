from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('api/auth/register',views.register),
    path('api/auth/login',views.login),
    path('api/server/config',views.clientConfig),
    path('api/devices/all',views.allDevices),
    path('api/base/fonImage',views.fonImage),
    # re_path(r'^.', views.index,),
]
