import logging

from app.configuration.settings import ROUTE_PREFIX
from app.internal.module.restart import restart_container
from app.internal.module.schemas.modules import Containers
from app.internal.module.get_by_label import get_containers_by_label

from fastapi import APIRouter
from fastapi.responses import JSONResponse

TYPE_CORE = "core"

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/core",
	tags=["core"],
	responses={404: {"description": "Not found"}},
)

@router.get("/all", response_model=Containers)
async def get_role():
	try:
		return Containers(data=get_containers_by_label(["sh-core.core", "sh-core.auth"]))
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/restart/{id}")
async def get_role(id: str):
	try:
		restart_container(id)
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
