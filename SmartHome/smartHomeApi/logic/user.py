from django.conf import settings
from ..models import User, UserConfig,genId,MenuElement
import json
import bcrypt
import jwt

import smtplib


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
        return {"message":"неверные данные"}
    except Exception as e:
        return {"message":e}

def user(id):
    user = User.objects.get(id=id)
    return user.model_to_dict()

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
    ret = user.give()
    return ret

def userConfEdit(id, data):
    try:
        user = User.objects.get(id=id)
        user.userconfig.Style = data["style"]
        user.userconfig.auteStyle = data["auteStyle"]
        user.userconfig.staticBackground = data["staticBackground"]
        user.userconfig.save()
        return True
    except Exception as e:
        return False

def menuConfEdit(id, data):
    try:
        user = User.objects.get(id=id)
        user.menuelement_set.all().delete()
        for item in data:
            user.menuelement_set.create(id = genId(MenuElement.objects.all()), title = item["title"],iconClass=item["iconClass"],url=item["url"])
        return True
    except Exception as e:
        return False

def Setbackground(id,background):
    try:
        user = User.objects.get(id=id)
        backgrounds = user.userconfig.background.all()
        for item in backgrounds:
            if(item.title==background.title):
                user.userconfig.background.remove(item)
        user.userconfig.background.add(background)
        return True
    except Exception as e:
        return False

def send_email(host, subject, to_addr, from_addr,from_pass, body_text):
    """
    Send an email
    """

    BODY = "\r\n".join((
        "From: %s" % from_addr,
        "To: %s" % to_addr,
        "Subject: %s" % subject ,
        "",
        body_text
    ))

    server = smtplib.SMTP(host)
    server.login(from_addr,from_pass)
    print(from_addr, [to_addr], BODY)
    # server = smtplib.SMTP('localhost')
    # server.set_debuglevel(1)
    server.sendmail(from_addr, [to_addr], BODY)
    server.quit()
