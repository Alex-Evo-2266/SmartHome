from django.conf import settings
from ..models import User, UserConfig
import json
import bcrypt
import jwt


def addUser(data):
    try:
        hashedPass = bcrypt.hashpw(data.get("password"),bcrypt.gensalt())
        newUser = User.objects.create(UserName=data.get("name"), UserEmail=data.get("email"), UserMobile=data.get("mobile"),UserPassword=hashedPass)
        newUser.save()
        newConf = UserConfig.objects.create(user=newUser)
        newConf.save()
        return True
    except:
        return False

def login(data):
    try:
        u = User.objects.get(UserName=data.get("name"))
        if bcrypt.checkpw(data.get("password"),u.UserPassword):
            encoded_jwt = jwt.encode({"userId":u.id,"userLevel":u.UserLevel},settings.SECRET_JWT_KEY,algorithm="HS256")
            result = {"token":encoded_jwt, "userId":u.id,"userLavel":u.UserLevel}
            return result
        return {}
    except:
        return {}

def user(id):
    user = User.objects.get(id=id)
    ret = {
        "UserName":user.UserName,
        "UserSurname":user.UserSurname,
        "Mobile":user.UserMobile,
        "Email":user.UserEmail,
        "ImageId":None
    }
    return ret

def editUser(id,data):
    try:
        print("start",id,data)
        data = data["newuser"]
        user = User.objects.get(id=id)
        user.UserName = data["UserName"]
        user.UserSurname = data["UserSurname"]
        user.UserMobile = data["Mobile"]
        user.UserEmail = data["Email"]
        user.save()
        print("end")
        return True
    except:
        return False


def userConf(id):
    user = User.objects.get(id=id)
    ret = {"Style":user.usersconfig.Style}
    return ret
def userConfEditStyle(id, style):
    try:
        user = User.objects.get(id=id)
        user.userconfig.Style = style
        user.userconfig.save()
        return True
    except Exception as e:
        return False
