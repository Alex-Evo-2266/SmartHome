import logging
import settings
from pydantic import BaseModel
from authtorization.models import Session
import requests
from authtorization.exceptions import AuthServiceException, InvalidArgumentException, NoDataToConnectException

logger = logging.getLogger(__name__)

class ConnectData(BaseModel):
	host: str
	client_secret: str
	client_id: str

class ThisLocalSession(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "this local session"
	
	def __str__(self) -> str:
		if self.message:
			return f"ThisLocalSession, {self.message}"
		else:
			return "ThisLocalSession"
			
class InvalidRefrash(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "invalid refrash"
	
	def __str__(self) -> str:
		if self.message:
			return f"InvalidRefrash, {self.message}"
		else:
			return "InvalidRefrash"

async def refrash(session: Session)->Session:
	connect_data = get_connect_data()
	host = connect_data.host + "/api/auth/refresh"
	headers = {'Content-Type': 'application/json'}
	data = {"refresh_token": session.refresh_oauth}
	response = requests.post(host, headers=headers, data=data, timeout=10)
	if response.status_code == 200:
		new_tokens = response.json()
		session.refresh_oauth = new_tokens["refresh"]
		session.access_oauth = new_tokens["access"]
		session.expires_at = new_tokens["expires_at"]
		await session.update(_columns=["refresh_oauth", "access_oauth", "expires_at"])
		return session
	else:
		raise InvalidRefrash(response.text)


def get_connect_data()->ConnectData:
	base_config = settings.configManager.getConfig("base")
	if not ("host" in base_config) or not ("client_id" in base_config) or not ("client_secret" in base_config):
		logger.warning("Data for connection to the authorization server was not found.")
		raise NoDataToConnectException("Data for connection to the authorization server was not found.")
	return ConnectData(host=base_config.get("host"), client_secret=base_config.get("client_secret"), client_id=base_config.get("client_id"))

async def castom_auth_service_requests(session: Session, url:str, params:dict | None = {}):
	connect_data = get_connect_data()
	host = connect_data.host + url
	if not session.access_oauth:
		raise ThisLocalSession()
	headers = {'authorization-token': f"Bearer {session.access_oauth}"}
	response = requests.get(host, headers=headers, params=params, timeout=10)
	if response.status_code == 401:
		await refrash(session)
		headers_new = {'authorization-token': f"Bearer {session.access_oauth}"}
		response_new = requests.get(host, headers=headers_new, params=params, timeout=10)
		if response_new.status_code != 200:
			raise Exception("invalid request")
		return response_new
	return response