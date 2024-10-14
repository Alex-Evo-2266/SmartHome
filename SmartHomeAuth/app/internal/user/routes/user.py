from asyncio.log import logger
import json, logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/users",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

@router.post("")
async def add(data: UserForm, auth_data: TokenData = Depends(token_dep)):
	pass

@router.get("", response_model=UserSchema)   #new
async def get(auth_data:TokenData = Depends(token_dep_all_user), session:Session = Depends(session)):
	pass

@router.put("")
async def edit(data: UserEditSchema, auth_data: TokenData = Depends(token_dep)):
	pass

@router.delete("/{id}")
async def delete(id: int, auth_data: TokenData = Depends(token_dep)):
	pass


@router.get("/all", response_model=List[UserSchema])
async def all(auth_data: TokenData = Depends(token_dep), session:Session = Depends(session)):
	pass

@router.put("/level")
async def level(data: UserEditLevelSchema, auth_data: TokenData = Depends(token_dep)):
	pass

@router.put("/password")
async def edit_password(data: UserEditPasswordSchema, auth_data: TokenData = Depends(token_dep)):
	pass

@router.get("/sessions", response_model=List[SessionSchema])
async def get_sessions_user(auth_data: TokenData = Depends(token_dep)):
	pass


@router.delete("/sessions/{id}")
async def get_session_user(id:int, auth_data: TokenData = Depends(token_dep)):
	pass
