from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('api/auth/register',views.register),
    path('api/auth/login',views.login),
    # re_path(r'^.', views.index,),
]
