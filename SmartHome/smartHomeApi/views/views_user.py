from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed,PermissionDenied,NotAuthenticated,ValidationError
from ..logic.user import login as Authorization, addUser, user, editUser, deleteUser, setLevel, editPass, newGenPass, userConfEdit, menuConfEdit
from ..logic.style import addstyle, getStyles,removeStyle
from ..logic.auth import auth

from ..models import User

import json

# Auth views

class LoginView(APIView):
    """docstring for Login."""
    def post(self,request):
        data = json.loads(request.body)
        res = Authorization(data)
        if(res["status"] == "ok"):
            return Response(res["data"],status=200)
        raise AuthenticationFailed(code=403, detail=res['detail'])

# user views

class UserView(APIView):
    """docstring for AddUserView."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        if auth_data['user_level'] != 3:
            raise PermissionDenied(code=403, detail="not enough rights for the operation.")
        data = json.loads(request.body)
        res = addUser(data)
        if res['status'] == 'ok':
            return Response({"detail":"ok"},status=201)
        raise ValidationError(detail=res['detail'])

    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = user(auth_data.get("user_id"))
        return Response(data)

    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        editUser(auth_data.get("user_id"),data)
        retData = user(auth_data.get("user_id"))
        return Response(retData,status=201)

    def delete(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        if auth_data['user_level'] != 3:
            raise PermissionDenied(code=403, detail="not enough rights for the operation.")
        data = json.loads(request.body)
        deleteUser(data["UserId"])
        Response({"detail":"ok"},status=200)

class UsersView(APIView):
    """docstring for GetUsers."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        users = User.objects.all()
        usersList = list()
        for item in users:
            usersList.append(item.model_to_dict())
        return Response(usersList)

class UserLevel(APIView):
    """docstring for EditUserLevel."""
    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        if auth_data['user_level'] != 3:
            raise PermissionDenied(code=403, detail="not enough rights for the operation.")
        data = json.loads(request.body)
        setLevel(data["id"],data["level"])
        return Response({"detail":"ok"},status=200)

class UserEditPassword(APIView):
    """docstring for userEditPassword."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        data = data["password"]
        editPass(auth_data["userId"],data["Old"],data["New"])
        return Response({"detail":"ok"},status=200)

class UserNewPassword(APIView):
    """docstring for User."""
    def post(self,request):
        data = json.loads(request.body)
        mes = newGenPass(data["name"])
        return Response({"detail":"ok"},status=200)

# user config views

class UserSetPage(APIView):
    """docstring for GetUsers."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        user = User.objects.get(id=auth_data.get("user_id"))
        user.userconfig.page = data["name"]
        user.userconfig.save()
        return Response({"detail":"ok"},status=200)

class UserConfigView(APIView):
    """docstring for ClientConfigView."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        user = User.objects.get(id=auth_data.get("user_id"))
        userconfig = user.userconfig.get()
        result={**userconfig,"MenuElements":user.getConfig()}
        return Response(result,status=200)

    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        userConfEdit(auth_data.get("user_id"),data)
        return Response({"detail":"ok"},status=201)

class MenuView(APIView):
    """docstring for MenuView."""
    def put(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        menuConfEdit(auth_data["user_id"],data)
        return Response({"detail":"ok"},status=201)

class CreateStyle(APIView):
    """docstring for CreateStyle."""
    def post(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        res = addstyle(data)
        if(res["status"] == "ok"):
            return Response({"detail":"ok"},status=201)
        return Response({'detail':res['detail']},status=400)

class Style(APIView):
    """docstring for CreateStyle."""
    def get(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        styles = getStyles()
        return Response(styles,status=200)

class RemoveStyle(APIView):
    """docstring for CreateStyle."""
    def delete(self,request):
        auth_data = auth(request)
        if auth_data['type'] != 'ok':
            raise NotAuthenticated(code=403, detail="invalid jwt")
        data = json.loads(request.body)
        removeStyle(data["name"])
        return Response({"detail":"ok"},status=200)
