from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional

from SmartHome.logic.auth import refresh_token as rtoken, login as Authorization
from SmartHome.schemas.auth import Login, Token

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

@router.post("/login")
async def login(data: Login):
    res = await Authorization(data)
    if(res["status"] == "ok"):
        p = res["data"]["response"]
        response = JSONResponse(status_code=200, content=p)
        response.set_cookie(key="refresh_toket", value=res["data"]["refresh"], httponly=True)
        return response
    return JSONResponse(status_code=403, content={"message": res['detail']})

@router.get("/refresh", response_model=Token)
async def ref(refresh_toket: Optional[str] = Cookie(None)):
    res = await rtoken(refresh_toket)
    if(res["status"] == "ok"):
        p = res["data"]["response"]
        response = JSONResponse(status_code=200, content=p)
        response.set_cookie(key="refresh_toket", value=res["data"]["refresh"], httponly=True)
        return response
    return JSONResponse(status_code=403, content={"message": res['detail']})
