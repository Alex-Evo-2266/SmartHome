from datetime import datetime, timedelta
from pydantic import BaseModel
import asyncio
import logging
from typing import Any, Callable, List, Dict

logger = logging.getLogger(__name__)

class EventLoopItem(BaseModel):
    name: str
    interval: int
    function: Callable[[], Any]
    next_run: datetime

class EventLoop:
    def __init__(self):
        self.functions: Dict[str, EventLoopItem] = {}
        self.tasks: Dict[str, asyncio.Task] = {}
        self.running = False

    def register(self, key: str, function: Callable[[], Any], interval: int = 0):
        self.functions[key] = EventLoopItem(
            name=key,
            function=function,
            interval=interval,
            next_run=datetime.now()
        )

    def unregister(self, key: str):
        self.functions.pop(key, None)
        task = self.tasks.pop(key, None)
        if task and not task.done():
            task.cancel()

    def clear(self):
        self.functions.clear()
        for task in self.tasks.values():
            if not task.done():
                task.cancel()
        self.tasks.clear()

    async def _run_task(self, item: EventLoopItem):
        try:
            await item.function()
        except Exception as e:
            logger.error(f"Ошибка выполнения функции {item.name}: {e}")

    def handle_task_done(self, task: asyncio.Task):
        if exception := task.exception():
            logger.error(f"Ошибка в задаче: {exception}")
        self.tasks.pop(task.get_name(), None)

    async def run(self):
        self.running = True
        while self.running:
            now = datetime.now()
            to_remove = []

            for key, item in list(self.functions.items()):
                if now >= item.next_run:
                    task = asyncio.create_task(self._run_task(item), name=key)
                    # if key in self.tasks:
                    #     self.tasks[key].cancel()
                    self.tasks[key] = task
                    task.add_done_callback(self.handle_task_done)

                    if item.interval > 0:
                        item.next_run = now + timedelta(seconds=item.interval)
                    else:
                        to_remove.append(key)

            for key in to_remove:
                self.unregister(key)

            await asyncio.sleep(1)

    def stop(self):
        self.running = False
        for task in self.tasks.values():
            if not task.done():
                task.cancel()
        self.tasks.clear()