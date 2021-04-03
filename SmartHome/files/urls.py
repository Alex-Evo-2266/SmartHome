from django.urls import path,re_path
from . import views

urlpatterns = [
    path('movies/all',views.MoviesView.as_view()),
]
