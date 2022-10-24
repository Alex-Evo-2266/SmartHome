from fastapi import APIRouter, Depends, HTTPException, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional
from SmartHome.schemas.base import TypeRespons

from SmartHome.schemas.auth import Login, OAuthLogin, ResponseLogin, Token, AuthService
from settings import configManager

router = APIRouter(
	prefix="/api/auth",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
)

@router.get("/clientid", response_model=AuthService)
async def ref():
	data = configManager.getConfig("base")
	return AuthService(clientId=data["client_id"], authservice="True", host=data["host"])
