from django.conf import settings
from SmartHome.settings import SERVER_CONFIG
from ..models import User, UserConfig,genId,MenuElement
import json
import bcrypt
import random
import jwt
import yaml

import smtplib


def addUser(data):
    try:
        hashedPass = bcrypt.hashpw(data.get("password"),bcrypt.gensalt())
        cond = User.objects.filter(UserName=data.get("name"))
        if(cond):
            return False
        newUser = User.objects.create(UserName=data.get("name"), UserEmail=data.get("email"), UserMobile=data.get("mobile"),UserPassword=hashedPass)
        newUser.save()
        newConf = UserConfig.objects.create(user=newUser)
        newConf.save()
        message = "login = " + data.get("name") + "\npassword = " + data.get("password")
        send_email("Account smart home",data.get("email"),message)
        return True
    except Exception as e:
        print("error add user",e)
        return False

def deleteUser(id):
    try:
        u = User.objects.get(id=id)
        message = "Account deleted name = " + u.UserName
        send_email("Account smart home",u.UserEmail,message)
        u.delete()
        return True
    except:
        return False

def login(data):
    try:
        u = User.objects.get(UserName=data.get("name"))
        print(u.UserPassword,data.get("password"))
        if bcrypt.checkpw(data.get("password"),u.UserPassword):
            print(u.id)
            print(u.UserLevel)
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

def setLevel(id, level):
    levelList = ["low","mid","admin"]
    try:
        user = User.objects.get(id=id)
        user.UserLevel = level
        user.save()
        message = user.UserName + " account level changed to '" + levelList[int(level)-1] + "'"
        send_email("Account smart home",user.UserEmail,message)
        return True
    except Exception as e:
        return False

def editPass(id, oldpass, newpass):
    try:
        u = User.objects.get(id=id)
        if bcrypt.checkpw(oldpass,u.UserPassword):
            hashedPass = bcrypt.hashpw(newpass,bcrypt.gensalt())
            u.UserPassword = hashedPass
            u.save()
            return "ok"
        return "неверный пароль"
    except Exception as e:
        return "error"

def newGenPass(name):
    try:
        user = User.objects.get(UserName = name)
        chars = '+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        length = 8
        password =''
        for i in range(length):
            password += random.choice(chars)
        print(password)
        message = "new Password for " + name + " = " + password
        send_email("Account smart home",user.UserEmail,message)
        hashedPass = bcrypt.hashpw(password,bcrypt.gensalt())
        user.UserPassword = hashedPass
        user.save()
        return "ok"
    except Exception as e:
        return "error " + str(e)

# def Setbackground(id,background):
#     try:
#         user = User.objects.get(id=id)
#         backgrounds = user.userconfig.background.all()
#         for item in backgrounds:
#             if(item.title==background.title):
#                 user.userconfig.background.remove(item)
#         user.userconfig.background.add(background)
#         return True
#     except Exception as e:
#         return False

def parser(str1,str2)->str:
    str1 = str1.replace(" ","")
    str1 = str1.replace("\n","")
    poz = str1.find(str2)
    if(poz!=-1):
        lenght = len(str2)
        str1 = str1[poz+lenght+1:]
        return str1
    return None

def send_email(subject, to_email, message):
    """
    Send an email
    """

    templates = None
    with open(SERVER_CONFIG) as f:
        templates = yaml.safe_load(f)
    acaunt = templates["mail"]
    from_email = acaunt["login"]
    password = acaunt["password"]

    try:
        BODY = "\r\n".join((
            "From: %s" % from_email,
            "To: %s" % to_email,
            "Subject: %s" % subject ,
            "",
            message
        ))
        print(from_email,password)
        server = smtplib.SMTP_SSL('smtp.mail.ru')
        server.login(from_email,password)
        server.sendmail(from_email,to_email,BODY)
        server.quit()
    except Exception as e:
        print("ошибка отправки email ",e)
        return False
