from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from SmartHome.schemas.script import ScriptSchema
from SmartHome.logic.script.set_script import addscript
from SmartHome.logic.script.get_script import get_script, get_script_all
# from SmartHome.logic.script.scriptset import addscript, scriptDelete, scriptsetstatus
# from SmartHome.logic.script.scriptget import script, scripts, runScript

from authtorization.auth_depends import token_dep

router = APIRouter(
	prefix="/api/script",
	tags=["script"],
	responses={404: {"description": "Not found"}},
)

@router.post("")
async def create(data:ScriptSchema, auth_data: dict = Depends(token_dep)):
	print(data)
	addscript(data)
	return JSONResponse(status_code=400, content={"message": "df"})

@router.get("", response_model = Union[ScriptSchema, List[ScriptSchema]])
async def get(name: Union[str, None] = None, auth_data: dict = Depends(token_dep)):
	if name:
		data = get_script(name)
	else:
		data = get_script_all()
	return data


# @router.post("/add")
# async def get(data:ScriptSchema, auth_data: dict = Depends(token_dep)):
#     res = addscript(data)
#     if res.status == "ok":
#         return "ok"
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.post("/edit/{name}")
# async def get(name: str, data: ScriptSchema, auth_data: dict = Depends(token_dep)):
#     res = scriptDelete(name)
#     if res.status != "ok":
#         return JSONResponse(status_code=400, content={"message": res.detail})
#     res = addscript(data)
#     if res.status == "ok":
#         return "ok"
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.get("/get/{name}")
# async def get(name:str, auth_data: dict = Depends(token_dep)):
#     res = script(name + '.yml')
#     if res.status == "ok":
#         return res.data
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.get("/all")
# async def get(auth_data: dict = Depends(token_dep)):
#     res = scripts()
#     if res.status == "ok":
#         return res.data
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.get("/delete")
# async def get(name:str, auth_data: dict = Depends(token_dep)):
#     res = scriptDelete(name)
#     if res.status == "ok":
#         return "ok"
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.post("/status/set")
# async def get(data: StatusScriptSchema, auth_data: dict = Depends(token_dep)):
#     res = scriptsetstatus(data.name, data.status)
#     if res.status == "ok":
#         return "ok"
#     return JSONResponse(status_code=400, content={"message": res.detail})

# @router.get("/run")
# async def get(name: str, auth_data: dict = Depends(token_dep)):
#     res = runScript(name)
#     if res.status == "ok":
#         return "ok"
#     return JSONResponse(status_code=400, content={"message": res.detail})
