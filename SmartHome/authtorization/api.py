import logging
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
import requests
from authtorization.logic import local_login

from settings import AUTH_SERVICE_URL, configManager

from .schema import Login, ResponseLogin, ServiceLogin, TypeRespons

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/auth",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
)

@router.post("/login", response_model=ResponseLogin)
async def login(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
	try:
		res = await local_login(data)
		if(res.status == TypeRespons.OK):
			response.set_cookie(key="refresh_toket", value=res.data["refresh"], httponly=True)
			return res.data["response"]
		return JSONResponse(status_code=403, content={"message": res['detail']})
	except Exception as e:
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.post("", response_model=ResponseLogin)
async def login(response:Response = Response("ok", 200), data: ServiceLogin = ServiceLogin(code="")):
	try:
		base_config = configManager.getConfig("base")
		print(base_config)
		if not ("host" in base_config) or not ("client_id" in base_config) or not ("client_secret" in base_config):
			logger.warning("auth service not conect data")
			return JSONResponse(status_code=400, content={"message": "auth service not conect data"})
		host = configManager.getConfig("base").get("host")
		print(host)
		params = {"code":data.code, "client_id":base_config["client_id"], "client_secret":base_config["client_secret"], "redirect_uri":""}
		print(params)
		r = requests.get(host + "/api/auth/token",params=params,timeout=10)
		# print(host + "/api/token")
		print(r.status_code)
		print(r.text)
		# if(res.status == TypeRespons.OK):
		# 	response.set_cookie(key="refresh_toket", value=res.data["refresh"], httponly=True)
		# 	return res.data["response"]
		return JSONResponse(status_code=403, content={"message": r.text})
	except Exception as e:
		return JSONResponse(status_code=400, content={"message": str(e)})