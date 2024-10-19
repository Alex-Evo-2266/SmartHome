import logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends

from app.internal.auth.depends.auth import session_dep
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.schemas.auth import SessionSchema
from app.internal.auth.logic.get_session import get_session_user
from app.internal.auth.logic.delete_session import delete_session_user

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/session",
	tags=["session"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=SessionSchema)
async def get_session(userData:SessionDepData = Depends(session_dep)):
    await get_session_user(userData.user)

@router.delete("/{id}")
async def session_delete(id:str, userData:SessionDepData = Depends(session_dep)):
    await delete_session_user(id, userData.user)
