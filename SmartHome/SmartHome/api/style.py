from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from SmartHome.schemas.auth import TokenData
from auth_service.config import StyleData, get_style
from authtorization.models import Session

from SmartHome.depends.auth import session, token_dep

router = APIRouter(
	prefix="/api/style",
	tags=["style"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=StyleData)
async def add(auth_data: TokenData = Depends(token_dep), session:Session = Depends(session)):
	style = await get_style(session)
	return style