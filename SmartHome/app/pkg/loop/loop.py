from datetime import datetime, timedelta
from threading import Thread
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

class EventLoop(Thread):

	def __init__(self):
		super(EventLoop, self).__init__()
		self.functions:List[EventLoopItem] = []
		self.running = False

	def register(self, key: str, function, interval: int = 0):
		'''
		key: уникальное значение по которому можно определить функцию.
		при добавлении нескольких функций с одинаковым ключем применится только последняя.
		function: функция
		interval: интервал срабатывания. при interval == 0 выполнится только 1 раз
		'''
		for item in self.functions:
			if(item.name == key):
				item.interval = interval
				item.function = function
				return None
		self.functions.append(EventLoopItem(
			function=function,
			name=key,
			interval=interval,
			time_run=datetime.now()
		))

	def unregister(self, key: str):
		for item in self.functions:
			if(item.name == key):
				del item

	def clear(self):
		self.functions = []

	def stop(self):
		self.running = False

	def run(self):
		self.running = True
		asyncio.run(self.run_async())

	async def run_async(self):
		for item in self.functions:
			f = item.function
			await f()
		while self.running:
			for item in self.functions:
				if(item.interval > 0 and datetime.now() > (timedelta(seconds=item.interval) + item.time_run)):
					try:
						item.time_run = datetime.now()
						f = item.function
						await f()
					except Exception as e:
						logger.error(f"error call function {item.name}. detail:{e}")

			await asyncio.sleep(1)