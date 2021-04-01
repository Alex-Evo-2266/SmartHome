from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.files.uploadedfile import TemporaryUploadedFile

from .logic.user import addUser,send_email,deleteUser, login as Authorization, userConfEdit,menuConfEdit,user,editUser,Setbackground
from .logic.auth import auth
from .logic.devices import addDevice,giveDevice,editDevice,deleteDevice
from .logic.config import giveuserconf, editUsersConf as usersedit, ServerConfigEdit,GiveServerConfig
from .logic.Cart import setPage,getPage
from .logic.gallery import getFonUrl,deleteImage
from .logic.script import addscript,scripts,scriptDelete,script,scriptsetstatus,runScript as runscript
from .logic.deviceSetValue import setValue

from .models import User, UserConfig,ServerConfig,ImageBackground,genId,LocalImage

from .forms import ImageForm

import json

# Create your views here.

def register(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if addUser(data):
            return HttpResponse(json.dumps({"message":"ok"}))
    return HttpResponse(json.dumps({"message":"error"}),status=400)

# @csrf_exempt
def login(request):
    if request.method=="POST" and request.body:

        data = json.loads(request.body)
        print(data)
        res = Authorization(data)
        if("token" in res):
            return HttpResponse(json.dumps(res),status=200)
        else:
            return HttpResponse(json.dumps({"type":"error",**res}),status=400)
    return HttpResponse(status=400)

def clientConfig(request):
    data = auth(request)
    if "userId" in data:
        user = User.objects.get(id=data.get("userId"))
        result={**user.userconfig.give(),"MenuElements":user.geveConfig()}
        return HttpResponse(json.dumps(result),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def serverConfig(request):
    data = auth(request)
    if "userId" in data:
        result=GiveServerConfig()
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

def edituserconf(request):
    try:
        if request.method=="POST" and request.body:
            user = auth(request)
            data = json.loads(request.body)
            userConfEdit(user.get("userId"),data)
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

def deviceAdd(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        print(data)
        if addDevice(data):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

# def devicesGive(request):
#     if request.method=="GET":
#         ret = giveDevices()
#         if(ret):
#             return HttpResponse(json.dumps(ret),status=201)
#     return HttpResponse(json.dumps({"message":"error"}),status=400)

def deviceGive(request,id):
    if request.method=="GET":
        ret = giveDevice(id)
        if(ret):
            return HttpResponse(json.dumps(ret),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deviceEdit(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if editDevice(data):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deviceDelete(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        print(data)
        if deleteDevice(data["DeviceId"]):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deviceSetValue(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        print("data",data)
        if setValue(data["id"],data["type"],data["status"]):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def getHomeCart(request,id):
    if request.method=="GET":
        page = getPage(id)
        return HttpResponse(json.dumps({"message":"ok","page":page}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def setHomeCart(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        # print(data)
        if(setPage(data)):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def setBackground(request,name):
    if request.method=="POST":
        # print(name,request.FILES,request.POST)
        usertoken = auth(request)
        if "userId" in usertoken:
            form = ImageForm(request.POST, request.FILES)
            print(request.POST, request.FILES)
            if form.is_valid():
                id = genId(LocalImage.objects.all())
                fon = LocalImage.objects.create(id=id)
                if(type(request.FILES['image'])==TemporaryUploadedFile):
                    fon.image=request.FILES['image'].temporary_file_path()
                else:
                    fon.image=request.FILES['image']
                fon = form.save(commit=False)
                fon.title = name
                fon.id = id
                fon.save()
                Setbackground(usertoken.get("userId"),fon)
                return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def editmenu(request):
    usertoken = auth(request)
    if "userId" in usertoken:
        data = json.loads(request.body)
        print("ok",data,usertoken["userId"])
        if menuConfEdit(usertoken["userId"],data):
            return HttpResponse(json.dumps({"message":"ok"}),status=201)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def giveusers(request):
    users = User.objects.all()
    usersList = list()
    for item in users:
        usersList.append(item.model_to_dict())
    return HttpResponse(json.dumps(usersList),status=200)

def addNewUser(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if addUser(data):
            return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deleteuser(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if deleteUser(data["UserId"]):
            return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def addScript(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(addscript(data)):
            return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def getScripts(request):
    if request.method=="GET":
        allScripts = scripts()
        return HttpResponse(json.dumps(allScripts),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deleteScript(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(scriptDelete(data["id"])):
            return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def getScript(request,id):
    if request.method=="GET":
        Script = script(id)
        return HttpResponse(json.dumps(Script),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def editScript(request,id):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(scriptDelete(id)):
            if(addscript(data)):
                return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def setStatusScript(request):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if scriptsetstatus(data["id"],data["status"]):
            return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def runScript(request,id):
    runscript(id)
    return HttpResponse(json.dumps({"message":"ok"}),status=200)

def getTenUrl(request,type,index):
    if(type=="fon"):
        images = getFonUrl(index)
        print("images",images)
        return HttpResponse(json.dumps(images),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)

def deleteImg(request,type):
    if request.method=="POST" and request.body:
        data = json.loads(request.body)
        if(type=="fon"):
            if(deleteImage(data["id"])):
                return HttpResponse(json.dumps({"message":"ok"}),status=200)
    return HttpResponse(json.dumps({"message":"error"}),status=400)
