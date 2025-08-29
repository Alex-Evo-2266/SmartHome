import asyncio, logging
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class OldToken(BaseModel):
	old_refresh: str
	old_access:str
	new_refresh: str
	new_access:str
	expires_at: datetime

class OldTokens(object):
	arrayTokens: List[OldToken] = []

	@classmethod
	def add(cls, old_refresh:str, old_access:str, new_refresh:str, new_access:str, expires_at:datetime):
		logger.debug("add old token")
		logger.debug("old tokens", cls.arrayTokens)
		cls.arrayTokens.append(OldToken(old_refresh=old_refresh, old_access=old_access, new_refresh=new_refresh, new_access=new_access, expires_at=expires_at))
		logger.debug("old tokens", cls.arrayTokens)

	@classmethod
	def get_or_none(cls, old_refresh:str)->Optional[OldToken]:
		logger.debug("get old token")
		logger.debug("old tokens", cls.arrayTokens)
		for item in cls.arrayTokens:
			if (item.old_refresh == old_refresh):
				return item
		return None
	
	@classmethod
	def delete(cls, old_refresh:str):
		logger.debug("delete old token")
		logger.debug("old tokens", cls.arrayTokens)
		cls.arrayTokens = [s for s in cls.arrayTokens if s.old_refresh != old_refresh]
		logger.debug("old tokens", cls.arrayTokens)
	
	@classmethod
	async def delete_delay(cls, old_refresh:str, delay: int):
		await asyncio.sleep(delay)
		cls.delete(old_refresh)