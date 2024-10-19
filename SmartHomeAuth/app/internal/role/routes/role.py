import json, logging
from typing import Optional, List

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import user_preveleg_dep

from app.internal.role.logic.create_role import add_role
from app.internal.role.logic.get_role import get_role_all
from app.internal.role.logic.delete_role import delete_role_by_id
from app.internal.role.schemas.role import RoleForm, RoleResponseSchema
from app.internal.role.maps.map_role import map_role

from app.configuration.settings import BASE_ROLE

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/role",
	tags=["role"],
	responses={404: {"description": "Not found"}},
)

@router.post("")
async def add(data: RoleForm, user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await add_role(data)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[RoleResponseSchema])
async def get(user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		roles = await get_role_all()
		roles_data = []
		for role in roles:
			roles_data.append(await map_role(role))
		return roles_data
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{id}")
async def get(id:str, user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await delete_role_by_id(id)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))