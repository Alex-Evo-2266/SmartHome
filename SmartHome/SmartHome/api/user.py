from asyncio.log import logger
import json, logging

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from auth_service.config import get_style
from SmartHome.schemas.auth import TokenData
from authtorization.models import Session

from SmartHome.logic.user import addUser, setActivePage, getUser, menuConfEdit, userConfEdit, editUser, deleteUser, getUsers, editLevel, editPass, newGenPass, getConfig
from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, UserEditSchema, UserDeleteSchema, UserEditLevelSchema, UserEditPasswordSchema, UserNameSchema, MenuElementsSchema, UserConfigSchema
from SmartHome.depends.auth import session, token_dep

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/user",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

@router.post("/add")
async def add(data: UserForm, auth_data: dict = Depends(token_dep)):
	if auth_data['user_level'] != 3:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await addUser(data)
	if res['status'] == 'ok':
		return {"message":"ok"}
	return JSONResponse(status_code=400, content={"message": res['detail']})

@router.get("/get", response_model=UserSchema)   #new
async def get(auth_data:TokenData = Depends(token_dep)):
	try:
		user = await getUser(auth_data.user_id)
		return user
	except Exception as e:
		logger.warning(e)
		return JSONResponse(status_code=400, content=str(e))

@router.post("/edit")
async def edit(data: UserEditSchema, auth_data: dict = Depends(token_dep)):
	res = await editUser(auth_data['user_id'], data)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.post("/delete")
async def delete(data: UserDeleteSchema, auth_data: dict = Depends(token_dep)):
	if auth_data['user_level'] != 3:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	if (auth_data['user_id'] == data.UserId):
		return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
	res = await deleteUser(data.UserId)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: dict = Depends(token_dep)):
	res = await getUsers()
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return res['data']

@router.post("/level/edit")
async def level(data: UserEditLevelSchema, auth_data: dict = Depends(token_dep)):
	if auth_data['user_level'] != 3:
		return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
	res = await editLevel(data.id, data.level)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.post("/password/edit")
async def editpass(data: UserEditPasswordSchema, auth_data: dict = Depends(token_dep)):
	res = await editPass(auth_data['user_id'], data.Old, data.New)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.post("/password/new")
async def newpass(data: UserNameSchema):
	res = await newGenPass(data.name)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.get("/config", response_model=UserConfigSchema)
async def getconfig(auth_data: dict = Depends(token_dep), session:Session = Depends(session)):
	# res = await getConfig(auth_data['user_id'])
	# if res['status'] == 'error':
	# if not session.access_oauth:
	# 	return JSONResponse(status_code=400, content={"message": 'not relise'})
	# f = await get_color(session)
	return JSONResponse(status_code=400, content={"message": 'user not found'})
	# return res["data"]

@router.post("/config/edit")
async def editconfig(data: EditUserConfigSchema, auth_data: dict = Depends(token_dep)):
	# res = await userConfEdit(auth_data['user_id'], data)
	# if res['status'] == 'error':
		# return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.post("/menu/edit")
async def editconfig(data: List[MenuElementsSchema], auth_data: dict = Depends(token_dep)):
	res = await menuConfEdit(auth_data['user_id'], data)
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": 'user not found'})
	return "ok"

@router.get("/page/set")
async def editconfig(page: str, auth_data: dict = Depends(token_dep)):
	res = await setActivePage(page, auth_data['user_id'])
	if res['status'] == 'error':
		return JSONResponse(status_code=400, content={"message": res['detail']})
	return "ok"
