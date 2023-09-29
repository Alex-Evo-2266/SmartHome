import asyncio
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


class OldToken(BaseModel):
	old_refresh: str
	old_access:str
	new_refresh: str
	new_access:str
	expires_at: datetime

class OldTokens(object):
	arrayTokens: List[OldToken] = []

	@staticmethod
	def add(old_refresh:str, old_access:str, new_refresh:str, new_access:str, expires_at:datetime):
		print("add")
		OldTokens.arrayTokens.append(OldToken(old_refresh=old_refresh, old_access=old_access, new_refresh=new_refresh, new_access=new_access, expires_at=expires_at))
		print(OldTokens.arrayTokens)

	@staticmethod
	def get_or_none(old_refresh:str)->Optional[OldToken]:
		print("get")
		print(OldTokens.arrayTokens)
		for item in OldTokens.arrayTokens:
			if (item.old_refresh == old_refresh):
				return item
		return None
	
	@staticmethod
	def delete(old_refresh:str):
		OldTokens.arrayTokens = [s for s in OldTokens.arrayTokens if s.old_refresh != old_refresh]
		print(OldTokens.arrayTokens)
	
	@staticmethod
	async def delete_delay(old_refresh:str, delay: int):
		await asyncio.sleep(delay)
		OldTokens.delete(old_refresh)