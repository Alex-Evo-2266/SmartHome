from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from .models import User, UserConfig,ServerConfig
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
                        encoded_jwt = jwt.encode({"userId":item.id,"userLevel":item.UserLevel},settings.SECRET_JWT_KEY,algorithm="HS256")
                        result = {"token":encoded_jwt, "userId":item.id,"userLavel":item.UserLevel}
                        return HttpResponse(json.dumps(result),status=200)
                    else:
                        return HttpResponse(status=400)
                    break;
        except:
            return HttpResponse(status=400)
    return HttpResponse(status=400)

def clientConfig(request):
    head = request.headers["Authorization"]
    jwtdata = head.split(" ")[1]
    data = jwt.decode(jwtdata,SECRET_JWT_KEY,algorithms=["HS256"])
    user = User.objects.get(id=data.get("userId"))
    config = ServerConfig.objects.all()[0]
    server={"auteStyle":config.auteStyle,"staticBackground":config.staticBackground,"updateFrequency":config.updateFrequency,"mqttBroker":config.mqttBroker,"loginMqttBroker":config.loginMqttBroker,"passwordMqttBroker":config.passwordMqttBroker}
    result={"server":server,"user":user.userconfig.give()}
    return HttpResponse(json.dumps(result),status=200)

def allDevices(request):
    devices = Device.objects.all()
    result = []
    for item in result:
        result.append(json.dumps(item))
    print(result)
    return HttpResponse(json.dumps(result),status=200)

def fonImage(request):
    print("2")
    print(request.body)
