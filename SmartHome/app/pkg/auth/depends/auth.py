import logging
from typing import Annotated, Optional
from fastapi import Header, HTTPException, Request
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class Headers(BaseModel):
	Authorization: str | None
	X_status_auth: str | None
	X_forwarded_for: str | None
	X_user_id: str | None
	X_user_role: str | None
	Host: str | None
	X_user_privilege: str | None 
	
def split_privilege(privilege:str):
	privileges = [x.strip(' ') for x in privilege.split(',')]
	return privileges

def auth_privilege_dep(pivilege:str):
	async def _auth_privilege_dep(request: Request):
		try:
			headers_data = { 
				"Authorization": request.headers.get("authorization"),
				"X_status_auth": request.headers.get("x-status-auth"),
				"X_forwarded_for": request.headers.get("x-forwarded-for"),
				"X_user_id": request.headers.get("x-user-id"),
				"X_user_role": request.headers.get("x-user-role"),
				"Host": request.headers.get("host"),
				"X_user_privilege": request.headers.get("x-user-privilege"),
			}
			headers = Headers(**headers_data)
			print(headers)
			headers.X_user_privilege
			if not headers.X_user_id or not headers.X_user_privilege:
				raise HTTPException(status_code=400, detail="invalid auth data")
			for privilege_item in split_privilege(headers.X_user_privilege):
				if privilege_item == pivilege:
					return headers.X_user_id
			raise HTTPException(status_code=403, detail="invalid privilege")
		except Exception as e:
			logger.warning(f"token_dep error {e}")
			raise HTTPException(status_code=403, detail="invalid privilege")
	return _auth_privilege_dep