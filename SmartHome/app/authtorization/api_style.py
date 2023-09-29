from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.authtorization.schema import TokenData
from app.auth_service.config import StyleData, get_style
from app.authtorization.models import Session

from app.authtorization.auth_depends import session, token_dep_all_user

router = APIRouter(
	prefix="/api/users/styles",
	tags=["styles"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=StyleData)
async def get_style_api(auth_data: TokenData = Depends(token_dep_all_user), session:Session = Depends(session)):
	style = await get_style(session)
	return style