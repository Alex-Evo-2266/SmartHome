from django.shortcuts import render
from django.http import HttpResponse
from .models import User, UserConfig
import json
import bcrypt
import jwt

# Create your views here.
def index(request):
    return render(request,'client/build/index.html')

def register(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        hashedPass = bcrypt.hashpw(data.get("password"),bcrypt.gensalt())
        newUser = User.objects.create(UserName=data.get("name"), UserEmail=data.get("email"), UserMobile=data.get("mobile"),UserPassword=hashedPass)
        newUser.save()
        newConf = UserConfig.objects.create(user=newUser)
        newConf.save()
        result = {"message":"ok"}
        return HttpResponse(json.dumps(result))
    return HttpResponse("error")

def login(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        users = User.objects.all()
        try:
            for item in users:
                if item.UserName==data.get("name"):
                    if bcrypt.checkpw(data.get("password"),item.UserPassword):
                        encoded_jwt = jwt.encode({"userId":item.id,"userLevel":item.UserLevel},"secret",algorithm="HS256")
                        result = {"token":encoded_jwt, "userId":item.id,"userLavel":item.UserLevel}
                        return HttpResponse(json.dumps(result),status=200)
                    else:
                        return HttpResponse(status=400)
                    break;
        except:
            return HttpResponse(status=400)
    return HttpResponse(status=400)
