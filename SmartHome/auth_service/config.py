import logging
from auth_service.castom_requests import castom_auth_service_requests
from authtorization.models import Session
import settings
import requests
from authtorization.exceptions import AuthServiceException, InvalidArgumentException, NoDataToConnectException

logger = logging.getLogger(__name__)

async def get_color(session:Session):
	response = castom_auth_service_requests(session, "/api/color")
	if response.status_code != 200:
		logger.warning(response.text)
		raise AuthServiceException(response.text)
	print(response.json())
	return response.json()

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