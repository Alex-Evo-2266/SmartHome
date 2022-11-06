import logging, requests, json
from authtorization.exceptions import AuthServiceException
from auth_service.castom_requests import ThisLocalSession, castom_auth_service_requests, get_connect_data, refrash
from authtorization.models import Session

logger = logging.getLogger(__name__)

async def logout_service(session:Session)->None:
	connect_data = get_connect_data()
	host = connect_data.host + "/api/auth/logout"
	if not session.access_oauth:
		raise ThisLocalSession()
	headers = {'authorization-token': f"Bearer {session.access_oauth}"}
	data = dict()
	data["refresh_token"] = session.refresh_oauth
	data_json = json.dumps(data)
	response = requests.post(host, headers=headers, data=data_json, timeout=10)
	if response.status_code == 401:
		await refrash(session)
		headers_new = {'authorization-token': f"Bearer {session.access_oauth}"}
		data["refresh_token"] = session.refresh_oauth
		data_json = json.dumps(data)
		response_new = requests.post(host, headers=headers_new, data=data_json, timeout=10)
		if response_new.status_code != 200:
			raise Exception("invalid request")
	elif response.status_code != 200:
		raise Exception("invalid request")

