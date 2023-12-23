from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio
import logging
from typing import Any, Callable, List

logger = logging.getLogger(__name__)

class EventLoopItem(BaseModel):
	name: str
	interval: int
	function: Callable[[Any],Any]
	time_run: datetime

class EventLoop():
	functions:List[EventLoopItem] = []

	@classmethod
	def register(cls, name: str, function, interval: int = 0):
		for item in cls.functions:
			if(item.name == name):
				item.interval = interval
				item.function = function
				return None
		cls.functions.append(EventLoopItem(
			function=function,
			name=name,
			interval=interval,
			time_run=datetime.now()
		))

	@classmethod
	def unregister(cls, name: str):
		for item in cls.functions:
			if(item.name == name):
				del item

	@classmethod
	def clear(cls):
		cls.functions = []

	@classmethod
	async def run(cls):
		for item in cls.functions:
			f = item.function
			await f()
		while True:
			for item in cls.functions:
				if(item.interval > 0 and datetime.now() > (timedelta(seconds=item.interval) + item.time_run)):
					try:
						item.time_run = datetime.now()
						f = item.function
						await f()
					except Exception as e:
						logger.error(f"error call function {item.name}. detail:{e}")

			await asyncio.sleep(1)
