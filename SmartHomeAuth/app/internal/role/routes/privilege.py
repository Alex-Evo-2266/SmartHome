import json, logging
from typing import Optional, List

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import user_preveleg_dep

from app.internal.role.logic.create_privilege import add_privilege
from app.internal.role.logic.get_privilege import get_privilege_all
from app.internal.role.logic.delete_privilege import delete_privilege_by_id
from app.internal.role.schemas.role import PrivilegeForm, PrivilegeSchema

from app.configuration.settings import BASE_ROLE

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/privilege",
	tags=["privilege"],
	responses={404: {"description": "Not found"}},
)

@router.post("")
async def add(data: PrivilegeForm, user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await add_privilege(data)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[PrivilegeSchema])
async def get(user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		print("p89")
		privileges = await get_privilege_all()
		print("p89")
		return [PrivilegeSchema(id=x.id, privilege=x.privilege) for x in privileges]
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{id}")
async def get(id:str, user_data:SessionDepData = Depends(user_preveleg_dep(BASE_ROLE.ADMIN))):
	try:
		await delete_privilege_by_id(id)
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))