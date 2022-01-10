from fastapi import Header, HTTPException, Cookie
from typing import Optional

from SmartHome.logic.auth import auth

async def token_dep(authorization_token: Optional[str] = Header(None)):
    if not authorization_token:
        raise HTTPException(status_code=403, detail="token not found")
    auth_data = await auth(authorization_token)
    if auth_data['type'] == "outdated_jwt":
        raise HTTPException(status_code=401, detail="outdated jwt")
    if auth_data['type'] == 'error':
        raise HTTPException(status_code=403, detail="invalid jwt")
    return auth_data
