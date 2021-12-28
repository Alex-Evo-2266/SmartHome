from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse

from SmartHome.logic.auth import login as Authorization
from SmartHome.schemas.auth import Login

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)

@router.post("/login")
async def login(data: Login):
    res = await Authorization(data)
    if(res["status"] == "ok"):
        return res["data"]
    return JSONResponse(status_code=403, content={"message": res['detail']})
