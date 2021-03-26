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
        message = "login = " + data.get("name") + "\npassword = " + data.get("password")
        send_email("Account smart home",data.get("email"),message)
        return True
    except:
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
    from_email = ""
    password = ""
    try:
        accountfile = open("mail.txt", "r")
        for line in accountfile:
            clogin = parser(line,"login")
            cpassword = parser(line,"password")
            if clogin:
                from_email = clogin
            if cpassword:
                password = cpassword
        accountfile.close()
    except Exception as e:
        print("ошибка в файле ",e)
        return False

    try:
        BODY = "\r\n".join((
            "From: %s" % from_email,
            "To: %s" % to_email,
            "Subject: %s" % subject ,
            "",
            message
        ))

        server = smtplib.SMTP_SSL('smtp.mail.ru')
        server.login(from_email,password)
        server.sendmail(from_email,to_email,BODY)
        server.quit()
    except Exception as e:
        print("ошибка отправки email ",e)
        return False
