from django.shortcuts import render
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.core.files.uploadedfile import TemporaryUploadedFile
from rest_framework.response import Response
from rest_framework.views import APIView

from .logic.user import addUser,newGenPass,editPass,send_email,deleteUser,setLevel, login as Authorization, userConfEdit,menuConfEdit,user,editUser
from .logic.auth import auth
from .logic.devices import addDevice,giveDevice,editDevice,deleteDevice
from .logic.config.configget import GiveServerConfig,readConfig
from .logic.config.configset import ServerConfigEdit
from .logic.Cart import setPage,getPage
from .logic.gallery import getFonUrl,deleteImage,linkbackground
from .logic.script import addscript,scripts,scriptDelete,script,scriptsetstatus,runScript as runscript
from .logic.deviceSetValue import setValue
from .logic.weather import Weather
from .logic.deviceControl.mqttDevice.mqttScan import getTopicksAndLinc,ClearTopicks
from .logic.deviceControl.zigbee.zigbee import reboot
from .logic.deviceControl.zigbee.zigbeeDevices import getzigbeeDevices
from .logic.charts import getCharts
from .logic.style import addstyle, getStyles, getStyle

from .models import User, UserConfig,ImageBackground,genId,LocalImage,Device

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
        print("fgh")
        authData = auth(request)
        print(authData)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if addUser(data):
            return Response("ok",status=201)
        return Response(status=400)

    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if "userId" in authData:
            data = user(authData.get("userId"))
            return Response(data)

    def put(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if "userId" in authData:
            if(editUser(authData.get("userId"),data)):
                retData = user(authData.get("userId"))
                return Response(retData,status=201)

    def delete(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if deleteUser(data["UserId"]):
            return Response("ok",status=200)

class UsersView(APIView):
    """docstring for GetUsers."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        users = User.objects.all()
        usersList = list()
        for item in users:
            usersList.append(item.model_to_dict())
        return Response(usersList)

class UserLevel(APIView):
    """docstring for EditUserLevel."""
    def put(self,request,id):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if(authData["userLevel"]==3):
            if(setLevel(id,data["level"])):
                return Response("ok",status=200)
        else:
            return Response({"message":"error, нет прав на это действие"},status=400)

class UserEditPassword(APIView):
    """docstring for userEditPassword."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        data = data["password"]
        mes = editPass(authData["userId"],data["Old"],data["New"])
        if(mes=="ok"):
            return Response(json.dumps({"message":"ok"}),status=200)
        elif(mes!="error"):
            return Response(json.dumps({"message":mes}),status=400)

class UserNewPassword(APIView):
    """docstring for User."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        mes = newGenPass(data["name"])
        if(mes == "ok"):
            return Response("ok",status=200)

# user config views

class UserConfigView(APIView):
    """docstring for ClientConfigView."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if "userId" in authData:
            user = User.objects.get(id=authData.get("userId"))
            userconfig = user.userconfig.get()
            print(userconfig)
            result={**userconfig,"MenuElements":user.getConfig()}
            return Response(result,status=200)
        return Response(status=400)

    def put(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        userConfEdit(authData.get("userId"),data)
        return Response("ok",status=201)

class MenuView(APIView):
    """docstring for MenuView."""
    def put(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if "userId" in authData:
            data = json.loads(request.body)
            if menuConfEdit(authData["userId"],data):
                return Response("ok",status=201)

class CreateStyle(APIView):
    """docstring for CreateStyle."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        res = addstyle(data)
        if(res["status"] == "ok"):
            return Response("ok",status=201)
        return Response(res,status=400)

class Style(APIView):
    """docstring for CreateStyle."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        return Response(getStyles(),status=200)

# server views

class ServerConfigView(APIView):
    """docstring for ServerConfigView."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        ret = GiveServerConfig()
        return Response(ret)

    def put(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if(ServerConfigEdit(data)):
            return Response("ok",status=201)
        return Response(status=400)

class ServerData(APIView):
    """docstring for getServerData."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        return Response({
        "weather":Weather()
        })

# device views

class DeviceGetDeleteView(APIView):
    """docstring for DeviceView."""

    def get(self,request,id):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        ret = giveDevice(id)
        return Response(ret)

    def delete(self,request,id):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if deleteDevice(id):
            return Response("ok",status=201)

class DevicePutPostView(APIView):
    """docstring for DeviceView."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        print(data)
        if addDevice(data):
            return Response("ok",status=201)
        return Response("error",status=400)

    def put(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if editDevice(data):
            return Response("ok",status=201)

class SetValueDevice(APIView):
    """docstring for SetValueDevice."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if setValue(data["id"],data["type"],data["status"]):
            return Response("ok",status=201)
        return Response("err",status=400)

class SetStatusDevice(APIView):
    """docstring for SetStatusDevice."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        print(data)
        dev = Device.objects.get(id=data["id"])
        dev.DeviceStatus = data["status"]
        dev.save()
        return Response("ok",status=201)

# Charts
class GetCharts(APIView):
    """docstring for GetCharts."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        charts = getCharts()
        return Response(charts,status=200)

# mqtt

class MqttDevice(APIView):
    """docstring for getMqttDevice."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        dev = getTopicksAndLinc()
        return Response(dev,status=200)

class MqttClear(APIView):
    """docstring for MqttClear."""

    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        ClearTopicks()
        return Response("ok",status=201)

# zigbee2mqtt
class Zigbee2mqttReboot(APIView):
    """docstring for Zigbee2mqttReboot."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        config = readConfig()
        zigbeeConf = config["zigbee2mqtt"]
        reboot(zigbeeConf["topic"])
        return Response("ok",status=201)

class Zigbee2mqttDevice(APIView):
    """docstring for Zigbee2mqttDevice."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        return Response(getzigbeeDevices())



# home page views
class GetHomePageView(APIView):
    """docstring for GetHomeCart."""
    def get(self,request,id):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        page = getPage(id)
        return Response(page)

class SetHomePage(APIView):
    """docstring for SetHomePage."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if(setPage(data)):
            return Response("ok",status=201)

# media views

class SetBackground(APIView):
    """docstring for setBackground."""
    def post(self,request,name):
        authData = auth(request)
        if not authData:
            return Response(status=403)
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
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if(addscript(data)):
            return Response("ok",status=201)

class ScriptGetDeletePutView(APIView):
    """docstring for ScriptView."""

    def put(self,request,name):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if(scriptDelete(name)):
            if(addscript(data)):
                return Response("ok",status=200)

    def get(self,request,name):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        fullname = name + ".yml"
        Script = script(fullname)
        return Response(Script)

    def delete(self,request,name):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if(scriptDelete(name)):
            return Response("ok",status=201)

class GetScripts(APIView):
    """docstring for getScript."""
    def get(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        allScripts = scripts()
        return Response(allScripts)

class SetStatusScript(APIView):
    """docstring for setStatusScript."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        if scriptsetstatus(data["name"],data["status"]):
            return Response("ok",status=200)

class RunScript(APIView):
    """docstring for RunScript."""
    def get(self,request,name):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        runscript(name)
        return Response("ok",status=200)

# image view

class GetTenUrl(APIView):
    """docstring for GetTenUrl."""
    def get(self,request,type,index):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if(type=="fon"):
            images = getFonUrl(index)
            return Response(images)

class ImageView(APIView):
    """docstring for DeleteImage."""
    def delete(self,request,type,id):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        if(type=="fon"):
            if(deleteImage(id)):
                return Response("ok",status=200)

class linkBackgroundView(APIView):
    """docstring for linkBackgroundView."""
    def post(self,request):
        authData = auth(request)
        if not authData:
            return Response(status=403)
        data = json.loads(request.body)
        datauser = auth(request)
        if(linkbackground(data,datauser["userId"])):
            return Response("ok",status=200)
