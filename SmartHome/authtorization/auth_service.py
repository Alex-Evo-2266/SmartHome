
from authtorization.schema import AuthServiceTokens
from authtorization.exceptions import AuthServiceException, InvalidArgumentException, NoDataToConnectException

import logging
import settings
import requests


logger = logging.getLogger(__name__)

async def get_auth_service_tokens(code: str)->AuthServiceTokens:
	base_config = settings.configManager.getConfig("base")
	if not ("host" in base_config) or not ("client_id" in base_config) or not ("client_secret" in base_config):
		logger.warning("Data for connection to the authorization server was not found.")
		raise NoDataToConnectException("Data for connection to the authorization server was not found.")
	host = settings.configManager.getConfig("base").get("host")
	params = {"code":code, "client_id":base_config["client_id"], "client_secret":base_config["client_secret"], "redirect_uri":""}
	response = requests.get(host + settings.AUTH_SERVICE_GET_TOKENS_PATH, params=params, timeout=10)
	if response.status_code != 200:
		if response.text == "code not found":
			logger.warning("invalid code")
			raise InvalidArgumentException("invalid code")
		logger.warning(response.text)
		raise AuthServiceException(response.text)
	body = AuthServiceTokens(**(response.json()))
	return body

