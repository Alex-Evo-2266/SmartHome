import json, logging
from typing import Optional, List

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import session_dep, user_preveleg_dep

from app.internal.role.logic.get_role import get_role

from app.internal.user.schemas.user import UserForm, UserSchema, UserEditSchema, UserEditLevelSchema, UserEditPasswordSchema
from app.internal.user.logic.create_user import add_user
from app.internal.user.logic.get_user import get_user, get_all_users
from app.internal.user.logic.edit_user import edit_user, edit_user_password
from app.internal.user.logic.edit_role_user import edit_role
from app.internal.user.logic.delete_user import delete_user

from app.configuration.settings import BASE_ROLE

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/users",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

@router.post("")
async def add(data: UserForm, session:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await add_user(data)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("", response_model=UserSchema)
async def get(session:SessionDepData = Depends(session_dep)):
	try:
		return UserSchema(id=session.user.id, name=session.user.name, email=session.user.email, role=session.role.role_name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("/all", response_model=UserSchema)
async def get_all(session:SessionDepData = Depends(session_dep)):
	try:
		users = await get_all_users()
		users_data = []
		for user in users:
			await user.role.load()
			users_data.append(UserSchema(id=user.id, name=user.name, email=user.email, role=user.role.role_name))
		return users_data
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.get("/{id}", response_model=UserSchema)
async def get_by_id(id:str, session:SessionDepData = Depends(session_dep)):
	try:
		user = await get_user(id)
		await user.role.load()
		return UserSchema(id=user.id, name=user.name, email=user.email, role=user.role.role_name)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.put("")
async def edit(data:UserEditSchema, session:SessionDepData = Depends(session_dep)):
	try:
		await edit_user(session.user, data)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.delete("/{id}")
async def delete(id: int, session:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await delete_user(id)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.patch("/role")
async def level(data: UserEditLevelSchema, session:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		user = await get_user(data.id)
		role = await get_role(data.role)
		await edit_role(user, role)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))

@router.patch("/password")
async def edit_password(data: UserEditPasswordSchema, session:SessionDepData = Depends(session_dep)):
	try:
		await edit_user_password(session.user, data)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
