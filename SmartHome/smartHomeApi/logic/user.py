from django.conf import settings
from SmartHome.settings import SERVER_CONFIG
from ..models import User, UserConfig,genId,MenuElement
from rest_framework.exceptions import ValidationError
from .auth import create_token
import json, logging
import bcrypt
import random
import yaml

import smtplib

logger = logging.getLogger(__name__)

def addUser(data):
    try:
        logger.debug(f"add user input data: {data}")
        hashedPass = bcrypt.hashpw(data.get("password"),bcrypt.gensalt())
        cond = User.objects.filter(UserName=data.get("name"))
        if(cond):
            return {'status':'error', 'detail':'such user already exists.'}
        newUser = User.objects.create(UserName=data.get("name"), UserEmail=data.get("email"), UserMobile=data.get("mobile"),UserPassword=hashedPass)
        newUser.save()
        newConf = UserConfig.objects.create(user=newUser)
        newConf.save()
        message = "login = " + data.get("name") + "\npassword = " + data.get("password")
        logger.info(f"login input data: {data}")
        send_email("Account smart home",data.get("email"),message)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f"error add user: {e}")
        return {'status': 'error', 'detail': e}

def deleteUser(id):
    try:
        u = User.objects.get(id=id)
        message = "Account deleted name = " + u.UserName
        send_email("Account smart home",u.UserEmail,message)
        logger.info(f"user delete. id:{id}. user name:{u.UserName}")
        u.delete()
    except User.DoesNotExist as e:
        logger.error(f"none user: {e}")
        raise ValidationError(detail='none user')

def login(data):
    try:
        # logger.debug(f"login input data: {data}")
        u = User.objects.get(UserName=data.get("name"))
        if bcrypt.checkpw(data.get("password"),u.UserPassword):
            encoded_jwt = create_token(u.id)
            result = {"token":encoded_jwt, "userId":u.id,"userLavel":u.UserLevel}
            logger.info(f"login user: {u.UserName}, id: {u.id}")
            return {"status":"ok","data":result}
        return {"status":"error", "detail":"invalid data"}
    except Exception as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        return {"status":"error", "detail":e}

def user(id):
    try:
        user = User.objects.get(id=id)
        return user.model_to_dict()
    except User.DoesNotExist as e:
        logger.error(f"none user: {e}")
        raise ValidationError(detail='none user')


def editUser(id,data):
    try:
        data = data["newuser"]
        user = User.objects.get(id=id)
        user.UserName = data["UserName"]
        user.UserSurname = data["UserSurname"]
        user.UserMobile = data["Mobile"]
        user.UserEmail = data["Email"]
        user.save()
        logger.debug(f'edit user {id}')
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

def userConf(id):
    try:
        user = User.objects.get(id=id)
        ret = user.give()
        return ret
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")


def userConfEdit(id, data):
    try:
        logger.debug(f"userConfEdit input. id:{id}, data:{data}")
        user = User.objects.get(id=id)
        user.userconfig.Style = data["style"]
        user.userconfig.auteStyle = data["auteStyle"]
        user.userconfig.staticBackground = data["staticBackground"]
        user.userconfig.save()
        logger.debug(f"user edit config. id:{id}")
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

def menuConfEdit(id, data):
    try:
        logger.debug(f"menuConfEdit input. id:{id}, data:{data}")
        user = User.objects.get(id=id)
        user.menuelement_set.all().delete()
        for item in data:
            user.menuelement_set.create(id = genId(MenuElement.objects.all()), title = item["title"],iconClass=item["iconClass"],url=item["url"])
        logger.debug(f"user edit menu. id:{id}")
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

def setLevel(id, level):
    levelList = ["low","mid","admin"]
    try:
        user = User.objects.get(id=id)
        user.UserLevel = level
        user.save()
        message = user.UserName + " account level changed to '" + levelList[int(level)-1] + "'"
        logger.info(f'edit user level id:{id}')
        send_email("Account smart home",user.UserEmail,message)
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

def editPass(id, oldpass, newpass):
    try:
        u = User.objects.get(id=id)
        if bcrypt.checkpw(oldpass,u.UserPassword):
            hashedPass = bcrypt.hashpw(newpass,bcrypt.gensalt())
            u.UserPassword = hashedPass
            u.save()
            return
        logger.debug(f"user edit pass id:{id}")
        raise ValidationError(detail='Invalid password.')
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

def newGenPass(name):
    try:
        user = User.objects.get(UserName = name)
        chars = '+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        length = 8
        password =''
        for i in range(length):
            password += random.choice(chars)
        message = "new Password for " + name + " = " + password
        send_email("Account smart home",user.UserEmail,message)
        hashedPass = bcrypt.hashpw(password,bcrypt.gensalt())
        user.UserPassword = hashedPass
        user.save()
        logger.debug(f'gen new password. id:{id}')
        return
    except User.DoesNotExist as e:
        logger.error(f"user does not exist. id:{id}. detail: {e}")
        raise ValidationError(detail='none user')

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
    try:
        templates = None
        with open(SERVER_CONFIG) as f:
            templates = yaml.safe_load(f)
        acaunt = templates["mail"]
        from_email = acaunt["login"]
        password = acaunt["password"]
        if(from_email == '' or password == ''):
            logger.warning("no login or password from email")
            return

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
        logger.error(f"error send email. detail: {e}")
