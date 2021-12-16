from django.shortcuts import render
from django.conf import settings
# from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.core.files.uploadedfile import TemporaryUploadedFile
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed,PermissionDenied,NotAuthenticated,ValidationError

from ..logic.user import addUser,newGenPass,editPass,send_email,deleteUser,setLevel, login as Authorization, userConfEdit,menuConfEdit,user,editUser
from ..logic.auth import auth
from ..logic.Device import Devices
from ..logic.getDevices import giveDevice
from ..logic.editDevice import addDevice, editDevice, deleteDevice
from ..logic.config.configget import GiveServerConfig,readConfig
from ..logic.config.configset import ServerConfigEdit
from ..logic.Cart import setPage,getPage,addHomePage,deleteHomePage
from ..logic.gallery import getFonUrl,deleteImage,linkbackground
from ..logic.script import addscript,scripts,scriptDelete,script,scriptsetstatus,runScript as runscript
from ..logic.deviceSetValue import setValue
from ..logic.deviceTypes import getDeviceTypes
from ..logic.serverData import getServerData
from ..logic.deviceControl.mqttDevice.mqttScan import getTopicksAndLinc,ClearTopicks
from ..logic.deviceControl.zigbee.zigbee import reboot, permission_join, zigbeeDeviceRename, zigbeeDeviceDelete
from ..logic.deviceControl.zigbee.zigbeeDevices import getzigbeeDevices, getPermitJoin
from ..logic.charts import getCharts

from ..models import User, UserConfig,ImageBackground,genId,LocalImage

from ..forms import ImageForm

import json, logging

logger = logging.getLogger(__name__)


# server views

class ServerConfigView(APIView):
    """docstring for ServerConfigView."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        ret = GiveServerConfig()
        return Response(ret)

    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        ServerConfigEdit(data)
        return Response({"detail":"ok"},status=200)

class ServerData(APIView):
    """docstring for getServerData."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        serverData = getServerData()
        return Response(serverData)

# device views

class DeviceGetDeleteView(APIView):
    """docstring for DeviceView."""

    def get(self,request,id):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        ret = giveDevice(id)
        return Response(ret)

    def delete(self,request,id):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        res = deleteDevice(id)
        if (res['status'] == 'ok'):
            return Response({"detail":"ok"},status=200)
        raise ValidationError(code=400, detail=f"error delete device. {res['detail']}")

class DevicePutPostView(APIView):
    """docstring for DeviceView."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = addDevice(data)
        if res['status'] == 'ok':
            return Response({"detail":"ok"},status=201)
        raise ValidationError(code=400, detail=f"error added device. {res['detail']}")


    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = editDevice(data)
        if res['status'] == 'ok':
            return Response({"detail":"ok"},status=200)
        raise ValidationError(code=400, detail=f"error edit device. {res['detail']}")



class DeviceTypesView(APIView):
    """docstring for TypesDevice."""
    def get(self,request):
        ret = getDeviceTypes()
        if(ret["status"] == "ok"):
            return Response(ret["data"],status=200)
        return Response({'detail':ret['detail']},status=400)

class SetValueDevice(APIView):
    """docstring for SetValueDevice."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        if setValue(data["systemName"],data["type"],data["status"]):
            return Response({"detail":"ok"},status=200)
        return Response({"detail":"set value error"},status=400)

class SetStatusDevice(APIView):
    """docstring for SetStatusDevice."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        dev = Devices.get(systemName=data["systemName"])
        if(not dev):
            raise ValidationError(code=400, detail=f"device does not exist. {res['detail']}")
        dev.status = data["status"]
        dev.save()
        return Response({"detail":"ok"},status=200)

# Charts
class GetCharts(APIView):
    """docstring for GetCharts."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        charts = getCharts()
        return Response(charts,status=200)

# mqtt

class MqttDevice(APIView):
    """docstring for getMqttDevice."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        dev = getTopicksAndLinc()
        if(not dev):
            return Response({"detail":"unknown error"},status=400)
        return Response(dev,status=200)

class MqttClear(APIView):
    """docstring for MqttClear."""

    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        ClearTopicks()
        return Response({"detail":"ok"},status=200)

# zigbee2mqtt
class Zigbee2mqttReboot(APIView):
    """docstring for Zigbee2mqttReboot."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        config = readConfig()
        if not('zigbee2mqtt' in config):
            logger.error("invalid config file. not zigbee2mqtt key")
            return Response({"detail":"invalid config file"},status=400)
        zigbeeConf = config["zigbee2mqtt"]
        if not('topic' in zigbeeConf):
            logger.error("invalid config file. not topic key")
            return Response({"detail":"invalid config file"},status=400)
        reboot(zigbeeConf["topic"])
        return Response({"detail":"ok"},status=200)

class Zigbee2mqttPermJoin(APIView):
    """docstring for Zigbee2mqttReboot."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        config = readConfig()
        if not('zigbee2mqtt' in config):
            logger.error("invalid config file. not zigbee2mqtt key")
            return Response({"detail":"invalid config file"},status=400)
        zigbeeConf = config["zigbee2mqtt"]
        if not('topic' in zigbeeConf):
            logger.error("invalid config file. not topic key")
            return Response({"detail":"invalid config file"},status=400)
        permission_join(zigbeeConf["topic"],data["state"])
        return Response({"detail":"ok"},status=200)

    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        res = getPermitJoin()
        return Response(res,status=200)

class Zigbee2mqttDevice(APIView):
    """docstring for Zigbee2mqttDevice."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        return Response(getzigbeeDevices())

    def delete(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        try:
            data = json.loads(request.body)
            config = readConfig()
            if not('zigbee2mqtt' in config):
                logger.error("invalid config file. not zigbee2mqtt key")
                return Response({"detail":"invalid config file"},status=400)
            zigbeeConf = config["zigbee2mqtt"]
            if not('topic' in zigbeeConf):
                logger.error("invalid config file. not topic key")
                return Response({"detail":"invalid config file"},status=400)
            zigbeeDeviceDelete(zigbeeConf["topic"],data["name"])
            return Response({"detail":"ok"},status=200)
        except Exception as e:
            logger.error(f'error delete device: {e}')
            return Response({"detail":"error delete device"},status=400)

class Zigbee2mqttRename(APIView):
    """docstring for Zigbee2mqttDevice."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        try:
            data = json.loads(request.body)
            logger.debug(f"rename device input data:{data}")
            config = readConfig()
            if not('zigbee2mqtt' in config):
                logger.error("invalid config file. not zigbee2mqtt key")
                return Response({"detail":"invalid config file"},status=400)
            zigbeeConf = config["zigbee2mqtt"]
            if not('topic' in zigbeeConf):
                logger.error("invalid config file. not topic key")
                return Response({"detail":"invalid config file"},status=400)
            zigbeeDeviceRename(zigbeeConf["topic"],data["name"],data["newName"])
            logger.info("rename device")
            return Response({"detail":"ok"},status=200)
        except Exception as e:
            logger.error(f'error rename device: {e}')
            return Response({"detail":"error rename device"},status=400)

# home page views
class GetHomePageView(APIView):
    """docstring for GetHomeCart."""
    def get(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = getPage(name)
        if(data["type"]=="ok"):
            return Response(data["data"],status=200)
        return Response(data,status=400)

class SetHomePage(APIView):
    """docstring for SetHomePage."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        setPage(data)
        return Response({"detail":"ok"},status=200)

class AddHomePage(APIView):
    """docstring for SetHomePage."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = addHomePage(data["name"])
        if(res["type"]=="ok"):
            user = User.objects.get(id=auth_data.get("user_id"))
            user.userconfig.page = data["name"]
            user.userconfig.save()
            return Response({"detail":"ok"},status=200)
        return Response({"detail":res['detail']},status=400)

class DeleteHomePage(APIView):
    """docstring for DeleteHomePage."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = deleteHomePage(data["name"])
        if(res["type"]=="ok"):
            user = User.objects.get(id=authData.get("user_id"))
            user.userconfig.page = "basePage"
            user.userconfig.save()
            return Response({"detail":"ok"},status=200)
        return Response({"detail":res['detail']},status=400)


# media views

class SetBackground(APIView):
    """docstring for setBackground."""
    def post(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
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
            return Response({"detail":"ok"},status=200)
        raise ValidationError(code=400, detail=f"invalid input data.")


# script view

class ScriptPostView(APIView):
    """docstring for ScriptView."""

    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = addscript(data)
        if(res['status'] == 'ok'):
            return Response({"detail":"ok"},status=201)
        return Response({"detail":res['detail']},status=400)

class ScriptGetDeletePutView(APIView):
    """docstring for ScriptView."""

    def put(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = scriptDelete(name)
        if(res['status'] != 'ok'):
            return Response({"detail":res['detail']},status=400)
        res = addscript(data)
        if(res['status'] != 'ok'):
            return Response({"detail":res['detail']},status=400)
        return Response({"detail":'ok'},status=200)

    def get(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        fullname = name + ".yml"
        res = script(fullname)
        if('status' in res):
            if(res['status'] != 'ok'):
                return Response({"detail":res['detail']},status=400)
        return Response(res)

    def delete(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        res = scriptDelete(name)
        if(res['status'] == 'ok'):
            return Response("ok",status=201)
        return Response({"detail":res['detail']},status=400)

class GetScripts(APIView):
    """docstring for getScript."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        allScripts = scripts()
        return Response(allScripts)

class SetStatusScript(APIView):
    """docstring for setStatusScript."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = scriptsetstatus(data["name"],data["status"])
        if res['status'] == 'ok':
            return Response("ok",status=200)
        return Response({"detail":res['detail']},status=400)

class RunScript(APIView):
    """docstring for RunScript."""
    def get(self,request,name):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        res = runscript(name)
        if res['status'] == 'ok':
            return Response("ok",status=200)
        return Response({"detail":res['detail']},status=400)

# image view

class GetTenUrl(APIView):
    """docstring for GetTenUrl."""
    def get(self,request,type,index):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        if(type=="fon"):
            images = getFonUrl(index)
            return Response(images)
        return NotFound(code=404, detail="not this content")

class ImageView(APIView):
    """docstring for DeleteImage."""
    def delete(self,request,type,id):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        if(type=="fon"):
            res = deleteImage(id)
            if(res['status'] == 'ok'):
                return Response("ok",status=200)
            return Response({"detail":res['detail']},status=400)
        return NotFound(code=404, detail="not this content")

class linkBackgroundView(APIView):
    """docstring for linkBackgroundView."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = linkbackground(data,auth_data["user_id"])
        if(res['status']=='ok'):
            return Response("ok",status=200)
        return Response({"detail":res['detail']},status=400)
