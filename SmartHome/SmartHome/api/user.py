import json

from fastapi import APIRouter, Header
from fastapi.responses import JSONResponse
from typing import Optional, List

from SmartHome.logic.auth import auth
from SmartHome.logic.user import addUser, getUser, menuConfEdit, userConfEdit, editUser, deleteUser, getUsers, editLevel, editPass, newGenPass, getConfig
from SmartHome.schemas.user import UserForm, UserSchema, EditUserConfigSchema, UserEditSchema, UserDeleteSchema, UserEditLevelSchema, UserEditPasswordSchema, UserNameSchema, MenuElementsSchema, UserConfigSchema

router = APIRouter(
    prefix="/api/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

@router.post("/add")
async def add(data: UserForm, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    if auth_data['user_level'] != 3:
        return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
    res = await addUser(data)
    if res['status'] == 'ok':
        return {"message":"ok"}
    return JSONResponse(status_code=400, content={"message": res['detail']})

@router.get("/get", response_model=UserSchema)
async def get(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await getUser(auth_data['user_id'])
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res['data']

@router.post("/edit")
async def edit(data: UserEditSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await editUser(auth_data['user_id'], data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.post("/delete")
async def delete(data: UserDeleteSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    if auth_data['user_level'] != 3:
        return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
    if (auth_data['user_id'] == data.UserId):
        return JSONResponse(status_code=400, content={"message": "you can not delete yourself"})
    res = await deleteUser(data.UserId)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.get("/all", response_model=List[UserSchema])
async def all(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await getUsers()
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res['data']

@router.post("/editLevel")
async def level(data: UserEditLevelSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    if auth_data['user_level'] != 3:
        return JSONResponse(status_code=403, content={"message": "not enough rights for the operation."})
    res = await editLevel(data.id, data.level)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.post("/password/edit")
async def editpass(data: UserEditPasswordSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
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

@router.get("/config/get", response_model=UserConfigSchema)
async def getconfig(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await getConfig(auth_data['user_id'])
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return res["data"]

@router.post("/config/edit")
async def editconfig(data: EditUserConfigSchema, authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await userConfEdit(auth_data['user_id'], data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"

@router.post("/menu/edit")
async def editconfig(data: List[MenuElementsSchema], authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        return JSONResponse(status_code=403, content={"message": "token not found"})
    auth_data = await auth(authorization_token)
    if auth_data['type'] != 'ok':
        return JSONResponse(status_code=403, content={"message": "invalid jwt"})
    res = await menuConfEdit(auth_data['user_id'], data)
    if res['status'] == 'error':
        return JSONResponse(status_code=400, content={"message": 'user not found'})
    return "ok"
