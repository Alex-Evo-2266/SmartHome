import logging
from typing import Annotated, Optional
from fastapi import Header, HTTPException
from pydantic import BaseModel

from app.configuration import settings


logger = logging.getLogger(__name__)

class Headers(BaseModel):
	Authorization: Optional[str] = None
	X_status_auth: Optional[str] = None
	X_forwarded_for: Optional[str] = None
	Host: Optional[str] = None
	X_user_id:  Optional[str] = None
	X_user_role:  Optional[str] = None
	X_user_privilege:  Optional[str] = None
	
def split_privilege(privilege:str):
	privileges = [x.strip(' ') for x in privilege.split(',')]
	return privileges

def auth_privilege_dep(pivilege:str):
	async def _auth_privilege_dep(headers: Annotated[Headers, Header()]):
		try:
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