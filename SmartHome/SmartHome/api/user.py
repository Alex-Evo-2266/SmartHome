from asyncio.log import logger
import email
import json, logging

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from authtorization.logic import delete_session
from authtorization.schema import AuthType, SessionSchema, UserLevel
from auth_service.castom_requests import ThisLocalSession
from auth_service.config import get_style, get_user_data
from SmartHome.schemas.auth import TokenData
from authtorization.models import Session, User

from SmartHome.logic.user import addUser, getUser, editUser, deleteUser, getUsers, editLevel, editPass, newGenPass
from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, UserEditSchema, UserDeleteSchema, UserEditLevelSchema, UserEditPasswordSchema, UserNameSchema
from SmartHome.depends.auth import session, token_dep, token_dep_all_user

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/user",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

# @router.post("")
# async def add(data: UserForm, auth_data: TokenData = Depends(token_dep)):
# 	if auth_data['user_level'] != 3:
# 		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
# 	res = await addUser(data)
# 	if res['status'] == 'ok':
# 		return {"message":"ok"}
# 	return JSONResponse(status_code=400, content={"message": res['detail']})

@router.get("", response_model=UserSchema)   #new
async def get(auth_data:TokenData = Depends(token_dep_all_user), session:Session = Depends(session)):
	try:
		print(session.user)
		data = await get_user_data(session)
		user = await getUser(auth_data.user_id, session)
		ret = UserSchema(id=auth_data.user_id, name=user.name,host=data.host, email=data.email, role=user.role, image_url=data.imageURL, auth_type=AuthType.AUTH_SERVICE)
		return ret
	except ThisLocalSession:
		user = await getUser(auth_data.user_id, session)
		return user
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))

@router.put("")
async def edit(data: UserEditSchema, auth_data: TokenData = Depends(token_dep)):
	try:
		await editUser(auth_data.user_id, data)
		return "ok"
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e)) 

@router.delete("/{id}")
async def delete(id: int, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
		if (auth_data.user_id == id):
			return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
		await deleteUser(id)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))


@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: TokenData = Depends(token_dep), session:Session = Depends(session)):
	try:
		users = await getUsers(session)
		return users
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))

@router.put("/level")
async def level(data: UserEditLevelSchema, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
		await editLevel(data.id, data.role)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.put("/password")
async def edit_password(data: UserEditPasswordSchema, auth_data: TokenData = Depends(token_dep)):
	try:
		await editPass(auth_data.user_id, data.old_password, data.new_password)
		return "ok"
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))

@router.get("/sessions", response_model=List[SessionSchema])
async def get_session_user(auth_data: TokenData = Depends(token_dep)):
	try:
		user = await User.objects.get_or_none(id=auth_data.user_id)
		sessions = await Session.objects.all(user=user)
		arr = list()
		for item in sessions:
			arr.append(SessionSchema(id=item.id, auth_type=item.auth_type, expires_at=item.expires_at))
		return arr
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))


@router.delete("/sessions/{id}")
async def get_session_user(id:int, auth_data: TokenData = Depends(token_dep)):
	try:
		session = await Session.objects.get_or_none(id=id)
		if not session:
			return JSONResponse(status_code=400, content="session not found")
		user = await User.objects.get_or_none(id=auth_data.user_id)
		if session.user != user:
			return JSONResponse(status_code=400, content="alien session")
		await delete_session(session)
		return "ok"
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))

# @router.post("/password/new")
# async def newpass(data: UserNameSchema):
# 	res = await newGenPass(data.name)
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	return "ok"

# @router.get("/config", response_model=UserConfigSchema)
# async def getconfig(auth_data: dict = Depends(token_dep), session:Session = Depends(session)):
# 	# res = await getConfig(auth_data['user_id'])
# 	# if res['status'] == 'error':
# 	# if not session.access_oauth:
# 	# 	return JSONResponse(status_code=400, content={"message": 'not relise'})
# 	# f = await get_color(session)
# 	return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	# return res["data"]


# @router.post("/menu/edit")
# async def editconfig(data: List[MenuElementsSchema], auth_data: dict = Depends(token_dep)):
# 	res = await menuConfEdit(auth_data['user_id'], data)
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	return "ok"

# @router.get("/page/set")
# async def editconfig(page: str, auth_data: dict = Depends(token_dep)):
# 	res = await setActivePage(page, auth_data['user_id'])
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": res['detail']})
# 	return "ok"
