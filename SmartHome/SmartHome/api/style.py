from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from auth_service.config import StyleData, get_style
from authtorization.models import Session

from SmartHome.depends.auth import session, token_dep
from SmartHome.logic.style import addstyle, getStyles, removeStyle

router = APIRouter(
	prefix="/api/style",
	tags=["style"],
	responses={404: {"description": "Not found"}},
)

@router.get("", response_model=StyleData)
async def add(auth_data: dict = Depends(token_dep), session:Session = Depends(session)):
	style = await get_style(session)
	return style

# @router.post("/add")
# async def add(data: StyleSchemas, auth_data: dict = Depends(token_dep)):
#     res = await addstyle(data)
#     if res['status'] == 'error':
#         return JSONResponse(status_code=400, content={"message": "error add style"})
#     return "ok"

# @router.get("/all", response_model=List[StyleSchemas])
# async def add(auth_data: dict = Depends(token_dep)):
#     return await getStyles()

# @router.post("/delete")
# async def delete(data:StyleDeleteSchemas, auth_data: dict = Depends(token_dep)):
#     res = await removeStyle(data.name)
#     if res['status'] == 'error':
#         return JSONResponse(status_code=400, content={"message": res['detail']})
#     return "ok"
