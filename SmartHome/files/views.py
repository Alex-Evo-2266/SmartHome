from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.base import View

from .models import Movie
from .logic.transform import set_to_list_dict

import json
# Create your views here.

class MoviesView(View):
    def get(self,request):
        movies = Movie.objects.all()
        print(set_to_list_dict(movies))
        return HttpResponse(json.dumps({"movies":set_to_list_dict(movies)}))


        # return render(request,"movies/movie_list.html",{"movie_list":movies})
