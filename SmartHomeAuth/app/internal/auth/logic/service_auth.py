
from app.internal.auth.logic.token import temp_token_check
from fastapi import HTTPException
from app.internal.auth.logic.get_service_auth import service_config
from app.internal.role.logic.get_role import get_role_by_id
from app.internal.user.logic.get_user import get_user
from app.internal.auth.logic.create_session import create_session_module

async def module_service_auth(temp_token: str | None = None, path:str = "/", service:str = "", host="localhost"):
	payload = await temp_token_check(temp_token)
	print(payload)
	if not payload:
		raise HTTPException(403, "Role not allowed")
		
	if "service" not in payload or payload["service"] is None or payload["user_role"] is None:
		raise HTTPException(403, "Service not allowed")
	
	if payload["service"] != service:
		raise HTTPException(403, "invalid service in token")
		
	config = service_config(payload["service"], path=path)
	user = await get_user(payload["user_id"])
	user_role = await get_role_by_id(payload["user_role"])

	if user_role.role_name not in config.roles or not user:
		raise HTTPException(403, "permission denied")
		
	session = await create_session_module(user, service=service, host=host)

	return session
		