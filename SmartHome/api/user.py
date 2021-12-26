from fastapi import APIRouter, Header
from logic.auth import auth
from logic.user import addUser
from fastapi.responses import JSONResponse
from schemas.user import UserForm
from typing import Optional, List
import json

router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

@router.post("/add/")
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
