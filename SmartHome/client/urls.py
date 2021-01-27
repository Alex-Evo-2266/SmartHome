from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    re_path(r'^.', views.index,),
]
