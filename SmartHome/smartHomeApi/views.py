from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.core.files.uploadedfile import TemporaryUploadedFile
from rest_framework.response import Response
from rest_framework.views import APIView

from .logic.user import addUser,newGenPass,editPass,send_email,deleteUser,setLevel, login as Authorization, userConfEdit,menuConfEdit,user,editUser
from .logic.auth import auth
from .logic.devices import addDevice,giveDevice,editDevice,deleteDevice
from .logic.config import giveuserconf, editUsersConf as usersedit, GiveServerConfig, ServerConfigEdit
from .logic.Cart import setPage,getPage
from .logic.gallery import getFonUrl,deleteImage,linkbackground
from .logic.script import addscript,scripts,scriptDelete,script,scriptsetstatus,runScript as runscript
from .logic.deviceSetValue import setValue
from .logic.weather import Weather
from .logic.deviceControl.mqttDevice.mqttScan import getTopicksAll

from .models import User, UserConfig,ServerConfig,ImageBackground,genId,LocalImage

from .forms import ImageForm

import json

# Auth views

class LoginView(APIView):
    """docstring for Login."""
    def post(self,request):
        data = json.loads(request.body)
        res = Authorization(data)
        if("token" in res):
            return Response(res,status=200)
        return Response(status=400)

# user views

class UserView(APIView):
    """docstring for AddUserView."""
    def post(self,request):
        data = json.loads(request.body)
        if addUser(data):
            return Response("ok",status=201)
        return Response(status=400)

    def get(self,request):
        data = auth(request)
        if "userId" in data:
            data2 = user(data.get("userId"))
            return Response(data2)

    def put(self,request):
        datauser = auth(request)
        data = json.loads(request.body)
        if "userId" in datauser:
            if(editUser(datauser.get("userId"),data)):
                retData = user(datauser.get("userId"))
                return Response(retData,status=201)

    def delete(self,request):
        data = json.loads(request.body)
        if deleteUser(data["UserId"]):
            return Response("ok",status=200)

class UsersView(APIView):
    """docstring for GetUsers."""
    def get(self,request):
        users = User.objects.all()
        usersList = list()
        for item in users:
            usersList.append(item.model_to_dict())
        return Response(usersList)

class UserLevel(APIView):
    """docstring for EditUserLevel."""
    def put(self,request,id):
        data = json.loads(request.body)
        datauser = auth(request)
        if(datauser["userLevel"]==3):
            if(setLevel(id,data["level"])):
                return Response("ok",status=200)
        else:
            return Response({"message":"error, нет прав на это действие"},status=400)

class UserEditPassword(APIView):
    """docstring for userEditPassword."""
    def post(self,request):
        data = json.loads(request.body)
        data = data["password"]
        datauser = auth(request)
        mes = editPass(datauser["userId"],data["Old"],data["New"])
        if(mes=="ok"):
            return Response(json.dumps({"message":"ok"}),status=200)
        elif(mes!="error"):
            return Response(json.dumps({"message":mes}),status=400)

class UserNewPassword(APIView):
    """docstring for User."""
    def post(self,request):
        data = json.loads(request.body)
        mes = newGenPass(data["name"])
        if(mes == "ok"):
            return Response("ok",status=200)

# user config views

class UserConfigView(APIView):
    """docstring for ClientConfigView."""
    def get(self,request):
        data = auth(request)
        if "userId" in data:
            user = User.objects.get(id=data.get("userId"))
            result={**user.userconfig.get(),"MenuElements":user.getConfig()}
            return Response(result,status=200)
        return Response(status=400)

    def put(self,request):
        user = auth(request)
        data = json.loads(request.body)
        userConfEdit(user.get("userId"),data)
        return Response("ok",status=201)

class UsersConfigView(APIView):
    """docstring for GetUserConfigView."""
    def get(self,request):
        ret = giveuserconf()
        return Response(ret,status=200)

    def put(self,request):
        data = json.loads(request.body)
        if(usersedit(data)):
            return Response("ok",status=201)
        return Response(status=400)

class MenuView(APIView):
    """docstring for MenuView."""
    def put(self,request):
        usertoken = auth(request)
        if "userId" in usertoken:
            data = json.loads(request.body)
            if menuConfEdit(usertoken["userId"],data):
                return Response("ok",status=201)

# server views

class ServerConfigView(APIView):
    """docstring for ServerConfigView."""
    def get(self,request):
        ret = GiveServerConfig()
        return Response(ret)

    def put(self,request):
        data = json.loads(request.body)
        if(ServerConfigEdit(data)):
            return Response("ok",status=201)
        return Response(status=400)

class ServerData(APIView):
    """docstring for getServerData."""
    def get(self,request):
        return Response({
        "weather":Weather()
        })

# device views

class DeviceGetDeleteView(APIView):
    """docstring for DeviceView."""

    def get(self,request,id):
        ret = giveDevice(id)
        return Response(ret)

    def delete(self,request,id):
        if deleteDevice(id):
            return Response("ok",status=201)

class DevicePutPostView(APIView):
    """docstring for DeviceView."""
    def post(self,request):
        data = json.loads(request.body)
        if addDevice(data):
            return Response("ok",status=201)

    def put(self,request):
        data = json.loads(request.body)
        if editDevice(data):
            return Response("ok",status=201)

class SetValueDevice(APIView):
    """docstring for SetValueDevice."""
    def post(self,request):
        data = json.loads(request.body)
        if setValue(data["id"],data["type"],data["status"]):
            return Response("ok",status=201)

class MqttDevice(APIView):
    """docstring for getMqttDevice."""
    def get(self,request):
        dev = getTopicksAll()
        return Response(dev,status=200)

# home page views
class GetHomePageView(APIView):
    """docstring for GetHomeCart."""
    def get(self,request,id):
        page = getPage(id)
        return Response(page)

class SetHomePage(APIView):
    """docstring for SetHomePage."""
    def post(self,request):
        data = json.loads(request.body)
        if(setPage(data)):
            return Response("ok",status=201)

# media views

class SetBackground(APIView):
    """docstring for setBackground."""
    def post(self,request,name):
        usertoken = auth(request)
        if "userId" in usertoken:
            form = ImageForm(request.POST, request.FILES)
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
                return Response("ok",status=201)

# script view

class ScriptPostView(APIView):
    """docstring for ScriptView."""

    def post(self,request):
        data = json.loads(request.body)
        if(addscript(data)):
            return Response("ok",status=201)

class ScriptGetDeletePutView(APIView):
    """docstring for ScriptView."""

    def put(self,request,id):
        data = json.loads(request.body)
        if(scriptDelete(id)):
            if(addscript(data)):
                return Response("ok",status=200)

    def get(self,request,id):
        Script = script(id)
        return Response(Script)

    def delete(self,request,id):
        if(scriptDelete(id)):
            return Response("ok",status=201)

class GetScripts(APIView):
    """docstring for getScript."""
    def get(self,request):
        allScripts = scripts()
        return Response(allScripts)

class SetStatusScript(APIView):
    """docstring for setStatusScript."""
    def post(self,request):
        data = json.loads(request.body)
        if scriptsetstatus(data["id"],data["status"]):
            return Response("ok",status=200)

class RunScript(APIView):
    """docstring for RunScript."""
    def get(self,request,id):
        runscript(id)
        return Response("ok",status=200)

# image view

class GetTenUrl(APIView):
    """docstring for GetTenUrl."""
    def get(self,request,type,index):
        if(type=="fon"):
            images = getFonUrl(index)
            return Response(images)

class ImageView(APIView):
    """docstring for DeleteImage."""
    def delete(self,request,type,id):
        if(type=="fon"):
            if(deleteImage(id)):
                return Response("ok",status=200)

class linkBackgroundView(APIView):
    """docstring for linkBackgroundView."""
    def post(self,request):
        data = json.loads(request.body)
        datauser = auth(request)
        if(linkbackground(data,datauser["userId"])):
            return Response("ok",status=200)
