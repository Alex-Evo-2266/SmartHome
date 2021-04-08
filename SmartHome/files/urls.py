from django.urls import path,re_path
from . import views

urlpatterns = [
    path('movies/all',views.MoviesView.as_view()),
    path('movie/<int:id>',views.MovieView.as_view()),
    path('serials/all',views.SerialsView.as_view()),
    path('serial/<int:id>',views.SerialView.as_view()),
    path('actors/all',views.ActorsView.as_view()),
    path('ganres/all',views.GanresView.as_view()),
    path('category/all',views.CategorysView.as_view()),
    path('movies/add',views.AddMovie.as_view()),
    path('serials/add',views.AddSerial.as_view()),
    path('actor/add',views.AddActor.as_view()),
    path('ganre/add',views.AddGanre.as_view()),
    path('category/add',views.AddCategory.as_view()),

    path('movies/edit/<int:id>',views.EditMovie.as_view()),
    path('serials/edit/<int:id>',views.EditSerial.as_view()),
    path('actor/edit/<int:id>',views.EditActor.as_view()),
    path('ganre/edit/<int:id>',views.EditGanre.as_view()),
    path('category/edit/<int:id>',views.EditCategory.as_view()),
]
