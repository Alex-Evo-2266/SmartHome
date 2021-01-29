from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from .logic.user import addUser, login as Authorization, userConfEditStyle,user,editUser
from .logic.auth import auth
from .logic.config import giveuserconf, editUsersConf as usersedit, ServerConfigEdit
from .models import User, UserConfig,ServerConfig
import json

# Create your views here.

def register(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if addUser(data):
            return HttpResponse(json.dumps({"message":"ok"}))
    return HttpResponse(json.dumps({"message":"error"}))

def login(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        res = Authorization(data)
        if("token" in res):
            return HttpResponse(json.dumps(res),status=200)
    return HttpResponse(status=400)

def clientConfig(request):
    data = auth(request)
    if "userId" in data:
        user = User.objects.get(id=data.get("userId"))
        config = ServerConfig.objects.all()[0]
        server={"auteStyle":config.auteStyle,"staticBackground":config.staticBackground,"updateFrequency":config.updateFrequency,"mqttBroker":config.mqttBroker,"loginMqttBroker":config.loginMqttBroker,"passwordMqttBroker":config.passwordMqttBroker}
        result={"server":server,"user":user.userconfig.give()}
        return HttpResponse(json.dumps(result),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def editUsersConf(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(usersedit(data)):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def giveUserConf(request):
    ret = giveuserconf()
    if(ret):
        return HttpResponse(json.dumps(ret),status=200)
    return HttpResponse(status=400)

def clientConfigedit(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(ServerConfigEdit(data)):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}), status=400)

def edituserconfstyle(request):
    try:
        if request.method=="POST" and request.body:
            user = auth(request)
            data = json.loads(request.body)
            userConfEditStyle(user.get("userId"),data["style"])
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
        return HttpResponse(json.dumps({"message":"error"}),status=400)
    except :
        return HttpResponse(json.dumps({"message":"error"}),status=400)

def giveuser(request):
    data = auth(request)
    if "userId" in data:
        data2 = user(data.get("userId"))
        if(data2):
            return HttpResponse(json.dumps(data2),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def edituser(request):
    try:
        if request.method=="POST" and request.body:
            datauser = auth(request)
            data = json.loads(request.body)
            if "userId" in datauser:
                if(editUser(datauser.get("userId"),data)):
                    retData = user(datauser.get("userId"))
                    return HttpResponse(json.dumps(retData),status=201)
        return HttpResponse(json.dumps({"message":"error"}),status=400)
    except:
        return HttpResponse(json.dumps({"message":"error"}),status=400)




# def media(request, name):
#     print(name)
#     return HttpResponse("d")
# def allDevices(request):
#     devices = Device.objects.all()
#     result = []
#     for item in result:
#         result.append(json.dumps(item))
#     print(result)
#     return HttpResponse(json.dumps(result),status=200)
#
# def fonImage(request):
#     print("2")
#     print(request.body)
