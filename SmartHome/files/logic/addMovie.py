from django.core.files.uploadedfile import TemporaryUploadedFile

from ..models import Movie,MovieActor,MovieGanre,MovieCategory

from ..forms import ActorImageForm,MoviePosterForm,SerialPosterForm

import json
import datetime as DT

def addActor(request):
    try:
        print(request.POST,request.FILES)
        data = request.POST
        form = ActorImageForm(request.POST, request.FILES)
        if form.is_valid():
            actor = MovieActor()
            if(type(request.FILES['image'])==TemporaryUploadedFile):
                actor.image=request.FILES['image'].temporary_file_path()
            else:
                actor.image=request.FILES['image']
            actor = form.save(commit=False)
            datecomponents = data["date_of_birth"].split('-')
            date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
            print(data)
            actor.date_of_birth = date
            actor.name=data["name"]
            actor.discription = data["discription"]
            actor.url = data["url"]
            actor.save()
            return True
        return False
    except Exception as e:
        return False

def addMovie(request):
    print(request.POST,request.FILES)
    try:
        data = request.POST.dict()
        print("data",data)
        form = MoviePosterForm(request.POST, request.FILES)
        if form.is_valid():
            movie = Movie()
            if(type(request.FILES['poster'])==TemporaryUploadedFile):
                movie.poster=request.FILES['poster'].temporary_file_path()
            else:
                movie.poster=request.FILES['poster']
            movie = form.save(commit=False)
            datecomponents = data["date"].split('-')
            date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
            movie.world_premiere = date
            movie.title=data["title"]
            movie.tagline = data["tagline"]
            movie.year = data["year"]
            movie.country = data["country"]
            movie.discription = data["discription"]
            movie.budget=data["budget"]
            movie.fees_in_usa=data["fees_in_usa"]
            movie.fees_in_world=data["fees_in_world"]
            category = MovieCategory.objects.get(id=data["category"])
            movie.category = category
            movie.url = data["url"]
            movie.localUrl = data["urlLocal"]
            movie.grade = data["quality"]
            loaded = False
            if data["loaded"]=="true":
                loaded = True
            movie.loaded = loaded
            movie.save()
            for item in data["regisers"].split(','):
                actor = MovieActor.objects.get(id=item)
                print(actor)
                movie.directors.add(actor)
            for item in data["actors"].split(','):
                actor = MovieActor.objects.get(id=item)
                print(actor)
                movie.actors.add(actor)
            for item in data["ganres"].split(','):
                ganre = MovieGanre.objects.get(id=item)
                print(ganre)
                movie.genres.add(ganre)
            movie.save()
            return True
        return False

    except Exception as e:
        return False

def addSerial(request):
    print(request.POST,request.FILES)
    try:
        data = request.POST.dict()
        print("data",data)
        form = SerialPosterForm(request.POST, request.FILES)
        if form.is_valid():
            movie = Serial()
            if(type(request.FILES['poster'])==TemporaryUploadedFile):
                movie.poster=request.FILES['poster'].temporary_file_path()
            else:
                movie.poster=request.FILES['poster']
            movie = form.save(commit=False)
            datecomponents = data["date"].split('-')
            date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
            movie.world_premiere = date
            movie.title=data["title"]
            movie.tagline = data["tagline"]
            movie.year = data["year"]
            movie.country = data["country"]
            movie.discription = data["discription"]
            movie.budget=data["budget"]
            movie.fees_in_usa=data["fees_in_usa"]
            movie.fees_in_world=data["fees_in_world"]
            category = MovieCategory.objects.get(id=data["category"])
            movie.category = category
            movie.url = data["url"]
            movie.localUrl = data["urlLocal"]
            movie.grade = data["quality"]
            movie.count_seasons=data["count_seasons"]
            movie.save_seasons=data["save_seasons"]
            loaded = False
            if data["loaded"]=="true":
                loaded = True
            closed = False
            if data["closed"]=="true":
                closed = True
            movie.loaded = loaded
            movie.closed = closed
            movie.save()
            for item in data["regisers"].split(','):
                actor = MovieActor.objects.get(id=item)
                print(actor)
                movie.directors.add(actor)
            for item in data["actors"].split(','):
                actor = MovieActor.objects.get(id=item)
                print(actor)
                movie.actors.add(actor)
            for item in data["ganres"].split(','):
                ganre = MovieGanre.objects.get(id=item)
                print(ganre)
                movie.genres.add(ganre)
            movie.save()
            return True
        return False

    except Exception as e:
        return False

def editMovie(request,id):
    print(request.POST,request.FILES)
    try:
        data = request.POST.dict()
        print("data",data)
        movie = Movie.objects.get(id=id)
        if('poster' in request.FILES):
            form = MoviePosterForm(request.POST, request.FILES)
            if form.is_valid():
                if(type(request.FILES['poster'])==TemporaryUploadedFile):
                    movie.poster=request.FILES['poster'].temporary_file_path()
                else:
                    movie.poster=request.FILES['poster']
                movie = form.save(commit=False)
        datecomponents = data["date"].split('-')
        date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
        movie.world_premiere = date
        movie.title=data["title"]
        movie.tagline = data["tagline"]
        movie.year = data["year"]
        movie.country = data["country"]
        movie.discription = data["discription"]
        movie.budget=data["budget"]
        movie.fees_in_usa=data["fees_in_usa"]
        movie.fees_in_world=data["fees_in_world"]
        category = MovieCategory.objects.get(id=data["category"])
        movie.category = category
        movie.url = data["url"]
        movie.localUrl = data["urlLocal"]
        movie.grade = data["quality"]
        loaded = False
        if data["loaded"]=="true":
            loaded = True
        movie.loaded = loaded
        movie.directors.clear()
        movie.actors.clear()
        movie.genres.clear()
        for item in data["regisers"].split(','):
            actor = MovieActor.objects.get(id=item)
            print(actor)
            movie.directors.add(actor)
        for item in data["actors"].split(','):
            actor = MovieActor.objects.get(id=item)
            print(actor)
            movie.actors.add(actor)
        for item in data["ganres"].split(','):
            ganre = MovieGanre.objects.get(id=item)
            print(ganre)
            movie.genres.add(ganre)
        movie.save()
        return True

    except Exception as e:
        print("error",e)
        return False

def editSerial(request,id):
    print(request.POST,request.FILES)
    try:
        data = request.POST.dict()
        print("data",data)
        if('poster' in request.FILES):
            form = SerialPosterForm(request.POST, request.FILES)
            if form.is_valid():
                if(type(request.FILES['poster'])==TemporaryUploadedFile):
                    movie.poster=request.FILES['poster'].temporary_file_path()
                else:
                    movie.poster=request.FILES['poster']
                movie = form.save(commit=False)
        datecomponents = data["date"].split('-')
        date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
        movie.world_premiere = date
        movie.title=data["title"]
        movie.tagline = data["tagline"]
        movie.year = data["year"]
        movie.country = data["country"]
        movie.discription = data["discription"]
        movie.budget=data["budget"]
        movie.fees_in_usa=data["fees_in_usa"]
        movie.fees_in_world=data["fees_in_world"]
        category = MovieCategory.objects.get(id=data["category"])
        movie.category = category
        movie.url = data["url"]
        movie.localUrl = data["urlLocal"]
        movie.grade = data["quality"]
        loaded = False
        if data["loaded"]=="true":
            loaded = True
        movie.loaded = loaded
        for item in data["regisers"].split(','):
            actor = MovieActor.objects.get(id=item)
            print(actor)
            movie.directors.add(actor)
        for item in data["actors"].split(','):
            actor = MovieActor.objects.get(id=item)
            print(actor)
            movie.actors.add(actor)
        for item in data["ganres"].split(','):
            ganre = MovieGanre.objects.get(id=item)
            print(ganre)
            movie.genres.add(ganre)
        movie.save()
        return True

    except Exception as e:
        return False

def editActor(request,id):
    try:
        print(request.POST,request.FILES)
        data = request.POST
        actor = MovieActor.objects.get(id=id)
        if('image' in request.FILES):
            form = ActorImageForm(request.POST, request.FILES)
            if form.is_valid():
                if(type(request.FILES['image'])==TemporaryUploadedFile):
                    actor.poster=request.FILES['image'].temporary_file_path()
                else:
                    actor.poster=request.FILES['image']
                actor = form.save(commit=False)
        datecomponents = data["date_of_birth"].split('-')
        date = DT.date(int(datecomponents[0]),int(datecomponents[1]),int(datecomponents[2]))
        actor.date_of_birth = date
        actor.name=data["name"]
        actor.discription = data["discription"]
        actor.url = data["url"]
        actor.save()
        return True

    except Exception as e:
        return False
