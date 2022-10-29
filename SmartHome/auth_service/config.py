import logging
from turtle import title
from typing import List, Optional
from auth_service.castom_requests import ThisLocalSession, castom_auth_service_requests, get_connect_data
from authtorization.models import Session
import settings
from pydantic import BaseModel
import requests
from authtorization.exceptions import AuthServiceException, InvalidArgumentException, NoDataToConnectException

logger = logging.getLogger(__name__)

class Colors(BaseModel):
	title: str
	color1: str
	color2: str
	active: str

class Background(BaseModel):
	url: str
	type: str
	title: str
	host: Optional[str]

class StyleData(BaseModel):
	backgrounds: List[Background]
	light_style: Colors
	night_style: Colors
	special_style: Colors
	special_topic: bool

def_style_data = StyleData(
	backgrounds=[],
	light_style=Colors(title="deflight", color1="#303030", color2="#505050", active="#1e90ff"),
	night_style=Colors(title="defnight", color1="#303030", color2="#505050", active="#1e90ff"),
	special_style=Colors(title="defspec", color1="#303030", color2="#505050", active="#1e90ff"),
	special_topic=False
)


async def get_style(session:Session)->StyleData:
	try:
		response = await castom_auth_service_requests(session, "/api/users/config")
		if response.status_code != 200:
			logger.warning(response.text)
			raise AuthServiceException(response.text)
		res = response.json()
		images = res.get("backgrounds")
		connect_data = get_connect_data()
		if images:
			for item in images:
				item["host"] = connect_data.host
		styles = StyleData(backgrounds=images, light_style=res.get("colors"), night_style=res.get("night_colors"), special_style=res.get("special_colors"), special_topic=res.get("special_topic"))
		return styles
	except ThisLocalSession:
		return def_style_data

class ResponseUserData(BaseModel):
	id: int
	name: str
	email: str
	level: int
	imageURL: Optional[str]
	host: Optional[str]

async def get_user_data(session:Session)->ResponseUserData:
	response = await castom_auth_service_requests(session, "/api/users")
	print(response)
	if response.status_code != 200:
		logger.warning(response.text)
		raise AuthServiceException(response.text)
	res = response.json()
	connect_data = get_connect_data()
	data = ResponseUserData(
		id = res["id"],
		name = res["name"],
		email = res["email"],
		level = res["level"],
		imageURL = connect_data.host + res["imageURL"],
		host = connect_data.host
	)
	return data





# async def get_user_config(session:Session):
# 	base_config = settings.configManager.getConfig("base")
# 	if not ("host" in base_config) or not ("client_id" in base_config) or not ("client_secret" in base_config):
# 		logger.warning("Data for connection to the authorization server was not found.")
# 		raise NoDataToConnectException("Data for connection to the authorization server was not found.")
# 	host = settings.configManager.getConfig("base").get("host")
# 	params = {"code":code, "client_id":base_config["client_id"], "client_secret":base_config["client_secret"], "redirect_uri":""}
# 	response = requests.get(host + settings.AUTH_SERVICE_GET_TOKENS_PATH, params=params, timeout=10)
# 	if response.status_code != 200:
# 		if response.text == "code not found":
# 			logger.warning("invalid code")
# 			raise InvalidArgumentException("invalid code")
# 		logger.warning(response.text)
# 		raise AuthServiceException(response.text)
# 	body = AuthServiceTokens(**(response.json()))
# 	return body