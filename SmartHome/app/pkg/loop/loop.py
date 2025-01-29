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
        self.running = False

    def register(self, key: str, function: Callable[[], Any], interval: int = 0):
        """
        Регистрирует функцию для выполнения.
        :param key: Уникальный идентификатор функции
        :param function: Функция для выполнения
        :param interval: Интервал выполнения в секундах (0 - однократный запуск)
        """
        self.functions[key] = EventLoopItem(
            name=key,
            function=function,
            interval=interval,
            next_run=datetime.now()
        )

    def unregister(self, key: str):
        """Удаляет зарегистрированную функцию по ключу."""
        self.functions.pop(key, None)

    def clear(self):
        """Очищает все зарегистрированные функции."""
        self.functions.clear()

    async def _run_task(self, item: EventLoopItem):
        try:
            await item.function()
        except Exception as e:
            logger.error(f"Ошибка выполнения функции {item.name}: {e}")

    async def run(self):
        """Запускает главный цикл выполнения событий."""
        self.running = True
        while self.running:
            now = datetime.now()
            tasks = []
            
            for key, item in list(self.functions.items()):
                if now >= item.next_run:
                    tasks.append(self._run_task(item))
                    if item.interval > 0:
                        item.next_run = now + timedelta(seconds=item.interval)
                    else:
                        del self.functions[key]
            
            if tasks:
                await asyncio.gather(*tasks)
            
            await asyncio.sleep(1)

    def stop(self):
        """Останавливает выполнение событий."""
        self.running = False