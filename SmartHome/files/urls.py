from django.urls import path,re_path
from . import views

urlpatterns = [
    path('movies',views.MoviesView.as_view()),
]
