# import logging
# import bcrypt
# import jwt
# import random

# from typing import Optional, List
# from datetime import datetime, timedelta
# from .images.fon import getBackgroundUser

# import settings
# from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, MenuElementsSchema, UserEditSchema, UserConfigSchema
# from SmartHome.models import User,MenuElement
# from SmartHome.logic.homePage import lookForPage
# from SmartHome.logic.email import send_email
# # from SmartHome

# logger = logging.getLogger(__name__)

# async def addUser(data: UserForm):
#     try:
#         logger.debug(f"add user input data: {data.dict()}")
#         hashedPass = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
#         cond = await User.objects.get_or_none(UserName=data.name)
#         if(cond):
#             return {'status':'error', 'detail':'such user already exists.'}
#         newUser = await User.objects.create(UserName=data.name, UserEmail=data.email, UserMobile=data.mobile,UserPassword=hashedPass)
#         message = "login = " + data.name + "\npassword = " + data.password
#         logger.info(f"login input data: {data.dict()}")
#         await send_email("Account smart home",data.email,message)
#         return {'status':'ok'}
#     except Exception as e:
#         logger.error(f"error add user: {e}")
#         return {'status': 'error', 'detail': e}

# async def getUser(id):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"none user")
#         return {"status":"error"}
#     return {"status":"ok", "data":UserSchema(
#         UserId=user.id,
#         UserName=user.UserName,
#         UserSurname=user.UserSurname,
#         Email=user.UserEmail,
#         Mobile=user.UserMobile,
#         Level=user.UserLevel,
#         ImageId=None
#     )}

# async def editUser(id: int,data: UserEditSchema):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"user does not exist. id:{id}")
#         return {"status":"error"}
#     user.UserName = data.UserName
#     user.UserSurname = data.UserSurname
#     user.UserMobile = data.Mobile
#     user.UserEmail = data.Email
#     await user.update(_columns=["UserName", "UserSurname", "UserMobile", "UserEmail"])
#     logger.debug(f'edit user {id}')
#     return {"status":"ok"}

# async def deleteUser(id):
#     u = await User.objects.get_or_none(id=id)
#     if not u:
#         logger.error(f"none user")
#         return {"status": "error", "detail":'none user'}
#     message = "Account deleted name = " + u.UserName
#     await send_email("Account smart home",u.UserEmail,message)
#     logger.info(f"user delete. id:{id}. user name:{u.UserName}")
#     await u.delete()
#     return {"status":"ok"}

# async def getUsers():
#     outUsers = list()
#     users = await User.objects.all()
#     if not users:
#         logger.error(f"none users")
#         return {"status":"error"}
#     for item in users:
#         outUsers.append(UserSchema(
#             UserId=item.id,
#             UserName=item.UserName,
#             UserSurname=item.UserSurname,
#             Email=item.UserEmail,
#             Mobile=item.UserMobile,
#             Level=item.UserLevel,
#             ImageId=None
#         ))
#     return {"status":"ok", "data":outUsers}

# async def editLevel(id: int, level: int):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"user does not exist. id:{id}")
#         return {"status":"error"}
#     user.UserLevel = level
#     await user.update(_columns=["UserLevel"])
#     logger.debug(f'edit level user {id}')
#     return {"status":"ok"}

# async def editPass(id: int, oldpass: str, newpass: str):
#     u = await User.objects.get_or_none(id=id)
#     if not u:
#         logger.error(f"user does not exist. id:{id}")
#         return {"status":"error"}
#     if bcrypt.checkpw(oldpass.encode('utf-8'),u.UserPassword.encode('utf-8')):
#         hashedPass = bcrypt.hashpw(newpass.encode('utf-8'),bcrypt.gensalt())
#         u.UserPassword = hashedPass
#         await u.update(_columns=["UserPassword"])
#     logger.debug(f"user edit pass id:{id}")
#     return {"status": "ok"}

# async def newGenPass(name: str):
#     user = await User.objects.get_or_none(UserName = name)
#     if not user:
#         logger.error(f"user does not exist. id:{id}")
#         return {"status":"error"}
#     chars = '+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
#     password =''
#     for i in range(settings.LENGTHPASS):
#         password += random.choice(chars)
#     message = "new Password for " + name + " = " + password
#     await send_email("Account smart home",user.UserEmail,message)
#     hashedPass = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
#     user.UserPassword = hashedPass
#     await user.update(_columns=["UserPassword"])
#     logger.debug(f'gen new password. id:{id}')
#     return {"status":"ok"}

# async def getMenuUser(id: int):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"none user")
#         return None
#     menu = await user.menuelements.all()
#     Menulist = list()
#     for item in menu:
#         Menulist.append(MenuElementsSchema(
#             id=item.id,
#             title=item.title,
#             url=item.url,
#             iconClass=item.iconClass
#         ))
#     return Menulist

# async def getConfig(id: int):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"none user")
#         return {"status":"error"}
#     res = UserConfigSchema(
#         Style=user.Style,
#         auteStyle=user.auteStyle,
#         staticBackground=user.staticBackground,
#         page=user.page,
#         images= await getBackgroundUser(id),
#         MenuElements= await getMenuUser(id)
#     )
#     return {"status":"ok", "data":res}

# async def setActivePage(name:str, id: int):
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"none user")
#         return {"status":"error", "detail": f"none user"}
#     res = lookForPage(name + ".yml")
#     if res.status != "ok":
#         logger.error(f"none page")
#         return {"status":"error", "detail": f"none page"}
#     user.page = name
#     await user.update(_columns=["page"])
#     return {"status":"ok"}

# async def userConfEdit(id: int, data: EditUserConfigSchema):
#     logger.debug(f"userConfEdit input. id:{id}, data:{data.dict()}")
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"user does not exist. id:{id}. detail: {e}")
#         return {"status":"error"}
#     user.Style = data.style
#     user.auteStyle = data.auteStyle
#     user.staticBackground = data.staticBackground
#     await user.update(_columns=["Style", "auteStyle", "staticBackground"])
#     logger.debug(f"user edit config. id:{id}")
#     return {"status":"ok"}

# async def menuConfEdit(id: int, data: List[MenuElementsSchema]):
#     logger.debug(f"menuConfEdit input. id:{id}, data:{data}")
#     user = await User.objects.get_or_none(id=id)
#     if not user:
#         logger.error(f"user does not exist. id:{id}. detail: {e}")
#         return {"status":'error'}
#     await MenuElement.objects.delete(user=user)
#     for item in data:
#         element = await MenuElement.objects.create(title = item.title,iconClass=item.iconClass,url=item.url)
#         await user.menuelements.add(element)
#     logger.debug(f"user edit menu. id:{id}")
#     return {"status":'ok'}
