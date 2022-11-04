from asyncio.log import logger
import email
import json, logging

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from auth_service.castom_requests import ThisLocalSession
from auth_service.config import get_style, get_user_data
from SmartHome.schemas.auth import TokenData
from authtorization.models import AuthType, Session

from SmartHome.logic.user import addUser, getUser, editUser, deleteUser, getUsers, editLevel, editPass, newGenPass
from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, UserEditSchema, UserDeleteSchema, UserEditLevelSchema, UserEditPasswordSchema, UserNameSchema
from SmartHome.depends.auth import session, token_dep

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
async def get(auth_data:TokenData = Depends(token_dep), session:Session = Depends(session)):
	try:
		data = await get_user_data(session)
		user = await getUser(auth_data.user_id)
		ret = UserSchema(id=auth_data.user_id, name=user.name,host=data.host, email=data.email, role=user.role, image_url=data.imageURL, auth_type=AuthType.AUTH_SERVICE)
		return ret
	except ThisLocalSession:
		user = await getUser(auth_data.user_id)
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

# @router.delete("")
# async def delete(data: UserDeleteSchema, auth_data: TokenData = Depends(token_dep)):
# 	if auth_data['user_level'] != 3:
# 		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
# 	if (auth_data['user_id'] == data.UserId):
# 		return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
# 	res = await deleteUser(data.UserId)
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	return "ok"

# @router.get("/all", response_model=List[UserSchema])
# async def all(auth_data: TokenData = Depends(token_dep)):
# 	res = await getUsers()
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	return res['data']

# @router.post("/level/edit")
# async def level(data: UserEditLevelSchema, auth_data: TokenData = Depends(token_dep)):
# 	if auth_data['user_level'] != 3:
# 		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
# 	res = await editLevel(data.id, data.level)
# 	if res['status'] == 'error':
# 		return JSONResponse(status_code=400, content={"message": 'user not found'})
# 	return "ok"

@router.put("/password")
async def edit_password(data: UserEditPasswordSchema, auth_data: TokenData = Depends(token_dep)):
	try:
		await editPass(auth_data.user_id, data.old_password, data.new_password)
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
