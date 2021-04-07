from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.base import View

from smartHomeApi.logic.auth import auth

from .logic.addMovie import addActor,addMovie

from .models import Movie,MovieActor,MovieGanre,MovieCategory,Serial
from .logic.transform import set_to_list_dict

import json
import datetime as DT
# Create your views here.

class MoviesView(View):
    def get(self,request):
        movies = Movie.objects.all()
        print(set_to_list_dict(movies))
        return HttpResponse(json.dumps({"movies":set_to_list_dict(movies)}))

class MovieView(View):
    def get(self,request,id):
        movies = Movie.objects.get(id=id)
        return HttpResponse(json.dumps({"movie":movies.model_to_dict()}))

class SerialsView(View):
    def get(self,request):
        movies = Serial.objects.all()
        print(set_to_list_dict(movies))
        return HttpResponse(json.dumps({"serials":set_to_list_dict(movies)}))

class SerialView(View):
    def get(self,request,id):
        movies = Serial.objects.get(id=id)
        return HttpResponse(json.dumps({"serial":movies.model_to_dict()}))

class ActorsView(View):
    def get(self,request):
        actors = MovieActor.objects.all()
        print(set_to_list_dict(actors))
        return HttpResponse(json.dumps({"actors":set_to_list_dict(actors)}))

class GanresView(View):
    def get(self,request):
        ganres = MovieGanre.objects.all()
        print(set_to_list_dict(ganres))
        return HttpResponse(json.dumps({"ganres":set_to_list_dict(ganres)}))

class CategorysView(View):
    def get(self,request):
        category = MovieCategory.objects.all()
        print(set_to_list_dict(category))
        return HttpResponse(json.dumps({"category":set_to_list_dict(category)}))

class AddMovie(View):
    def post(self,request):
        try:
            usertoken = auth(request)
            if "userId" in usertoken:
                if(addMovie(request)):
                    return HttpResponse(json.dumps({"message":"ok"}))
            return HttpResponse(status=400)
        except Exception as e:
            print(e)
            return HttpResponse(status=400)

class AddSerial(View):
    def post(self,request):
        try:
            usertoken = auth(request)
            if "userId" in usertoken:
                if(addSerial(request)):
                    return HttpResponse(json.dumps({"message":"ok"}))
            return HttpResponse(status=400)
        except Exception as e:
            print(e)
            return HttpResponse(status=400)

class AddActor(View):
    def post(self,request):
        try:
            usertoken = auth(request)
            if "userId" in usertoken:
                if(addActor(request)):
                    return HttpResponse(json.dumps({"message":"ok"}))
            return HttpResponse(status=400)
        except Exception as e:
            print(e)
            return HttpResponse(status=400)

class AddGanre(View):
    def post(self,request):
        try:
            data = request.POST
            category = MovieGanre.objects.create(name=data["name"],discription=data["discription"],url=data["url"])
            return HttpResponse(json.dumps({"message":"ok"}))
        except Exception as e:
            print(e)
            return HttpResponse(status=400)

class AddCategory(View):
    def post(self,request):
        try:
            data = request.POST
            category = MovieCategory.objects.create(name=data["name"],discription=data["discription"],url=data["url"])
            return HttpResponse(json.dumps({"message":"ok"}))
        except Exception as e:
            print(e)
            return HttpResponse(status=400)



        # return render(request,"movies/movie_list.html",{"movie_list":movies})
