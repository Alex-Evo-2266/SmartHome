import logging
import bcrypt
import jwt
import random

from typing import Optional, List
from datetime import datetime, timedelta
from authtorization.exceptions import UserNotFoundException
from authtorization.models import AuthType
from authtorization.schema import UserLevel

from SmartHome.exceptions import UserAlreadyExistsException
from .images.fon import getBackgroundUser

import settings
from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, UserEditSchema
from SmartHome.models import User, MenuElement
from SmartHome.logic.homePage import lookForPage
from SmartHome.logic.email import send_email
# from SmartHome

logger = logging.getLogger(__name__)

async def addUser(data: UserForm):
	try:
		logger.debug(f"add user input data: {data.dict()}")
		hashedPass = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
		cond = await User.objects.get_or_none(name=data.name)
		if(cond):
			raise UserAlreadyExistsException('such user already exists')
		newUser = await User.objects.create(name=data.name, email=data.email, password=hashedPass, auth_type=AuthType.LOGIN, role=UserLevel.BASE)
		message = "login = " + data.name + "\npassword = " + data.password
		logger.debug(f"login input data: {data.dict()}")
		await send_email("Account smart home",data.email,message)
		return newUser
	except Exception as e:
		logger.error(f"error add user: {e}")
		raise

async def getUser(id:int)->UserSchema:
	user = await User.objects.get_or_none(id=id)
	if not user:
		logger.error(f"none user")
		raise UserNotFoundException()
	return UserSchema(
		id=user.id,
		name=user.name,
		email=user.email,
		role=user.role,
		image_url=None,
		auth_type=user.auth_type
	)

async def editUser(id: int,data: UserEditSchema)->None:
	user = await User.objects.get_or_none(id=id)
	if not user:
		logger.error(f"user does not exist. id:{id}")
		raise UserNotFoundException()
	user.name = data.name
	user.email = data.email
	await user.update(_columns=["name", "email"])
	logger.debug(f'edit user {id}')

async def deleteUser(id:int):
	u = await User.objects.get_or_none(id=id)
	if not u:
		logger.error(f"none user")
		raise UserNotFoundException()
	message = "Account deleted name = " + u.name
	await send_email("Account smart home",u.email,message)
	logger.info(f"user delete. id:{id}. user name:{u.name}")
	await u.delete()

async def getUsers()->List[UserSchema]:
	outUsers:List[UserSchema] = list()
	users = await User.objects.all()
	if not users:
		logger.error(f"none users")
		raise UserNotFoundException()
	for item in users:
		outUsers.append(UserSchema(
			id=item.id,
			name=item.name,
			email=item.email,
			role=item.role,
			ImageId=None,
			auth_type=item.auth_type
		))
	return outUsers

async def editLevel(id: int, role: UserLevel):
	user = await User.objects.get_or_none(id=id)
	if not user:
		logger.error(f"user does not exist. id:{id}")
		raise UserNotFoundException()
	user.role = role
	await user.update(_columns=["role"])
	logger.debug(f'edit level user {id}')

async def editPass(id: int, oldpass: str, newpass: str):
	u = await User.objects.get_or_none(id=id)
	if not u:
		logger.error(f"user does not exist. id:{id}")
		raise UserNotFoundException()
	if bcrypt.checkpw(oldpass.encode('utf-8'),u.password.encode('utf-8')):
		hashedPass = bcrypt.hashpw(newpass.encode('utf-8'),bcrypt.gensalt())
		u.password = hashedPass
		await u.update(_columns=["password"])
	logger.debug(f"user edit pass id:{id}")

async def newGenPass(name: str):
	user = await User.objects.get_or_none(name = name)
	if not user:
		logger.error(f"user does not exist. id:{id}")
		raise UserNotFoundException()
	chars = '+-/*!&$#?=@<>abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
	password =''
	for i in range(settings.LENGTHPASS):
		password += random.choice(chars)
	message = "new Password for " + name + " = " + password
	await send_email("Account smart home",user.email,message)
	hashedPass = bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt())
	user.password = hashedPass
	await user.update(_columns=["password"])
	logger.debug(f'gen new password. id:{id}')

# async def setActivePage(name:str, id: int):
# 	user = await User.objects.get_or_none(id=id)
# 	if not user:
# 		logger.error(f"none user")
# 		return {"status":"error", "detail": f"none user"}
# 	res = lookForPage(name + ".yml")
# 	if res.status != "ok":
# 		logger.error(f"none page")
# 		return {"status":"error", "detail": f"none page"}
# 	user.page = name
# 	await user.update(_columns=["page"])
# 	return {"status":"ok"}

# async def userConfEdit(id: int, data: EditUserConfigSchema):
# 	logger.debug(f"userConfEdit input. id:{id}, data:{data.dict()}")
# 	user = await User.objects.get_or_none(id=id)
# 	if not user:
# 		logger.error(f"user does not exist. id:{id}. detail: {e}")
# 		return {"status":"error"}
# 	user.Style = data.style
# 	user.auteStyle = data.auteStyle
# 	user.staticBackground = data.staticBackground
# 	await user.update(_columns=["Style", "auteStyle", "staticBackground"])
# 	logger.debug(f"user edit config. id:{id}")
# 	return {"status":"ok"}
