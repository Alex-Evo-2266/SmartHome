
from app.ingternal.authtorization.schemas.authtorization import AuthServiceTokens
from app.pkg.auth_service.exceptions.service import AuthServiceException, InvalidArgumentException, NoDataToConnectException
from app.configuration.config import __module_config__

import logging
from app.configuration.settings import AUTH_SERVICE_GET_TOKENS_PATH
import requests


logger = logging.getLogger(__name__)

async def get_auth_service_tokens(code: str)->AuthServiceTokens:
	base_config = __module_config__.get_config("auth_service")
	if not ("host" in base_config) or not ("client_id" in base_config) or not ("client_secret" in base_config):
		logger.warning("Data for connection to the authorization server was not found.")
		raise NoDataToConnectException("Data for connection to the authorization server was not found.")
	host = __module_config__.get_config("auth_service").get("host")
	if not host:
		raise NoDataToConnectException("Data for connection to the authorization server was not found. 'host'")
	params = {"code":code, "client_id":base_config["client_id"], "client_secret":base_config["client_secret"], "redirect_uri":""}
	response = requests.get(host + AUTH_SERVICE_GET_TOKENS_PATH, params=params, timeout=10)
	if response.status_code != 200:
		if response.text == "code not found":
			logger.warning("invalid code")
			raise InvalidArgumentException("invalid code")
		logger.warning(response.text)
		raise AuthServiceException(response.text)
	body = AuthServiceTokens(**(response.json()))
	return body

