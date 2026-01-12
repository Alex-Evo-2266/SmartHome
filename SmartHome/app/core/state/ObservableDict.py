
from typing import Callable, Dict, List, Awaitable, Generic, TypeVar
import time
import asyncio, json
from app.core.services.utils.throttle import async_throttle_for_key
from app.pkg.logger import MyLogger

T = TypeVar("T")

logger = MyLogger().get_logger(__name__)

class ObservableDict(Generic[T]):
    def __init__(self):
        self._data = {}
        self._timestamps = {}
        self._subscribers: Dict[str, Dict[str, Callable[[str, T], Awaitable[None]]]] = {}
        self._global_subscribers: Dict[str, Callable[[str, T], Awaitable[None]]] = {}
        logger.info("ObservableDict инициализирован")

    @async_throttle_for_key(1)
    async def _notify_subscribers(self, key: str, value: T):
        
        # Уведомляем подписчиков ключа
        if key in self._subscribers:
            for callback in self._subscribers[key].values():
                if(callback):
                    await callback(key, value)
        # Уведомляем глобальных подписчиков
        for callback in self._global_subscribers.values():
            if(callback):
                await callback(key, value)

    def set(self, key: str, value: T) -> None:
        """Синхронно устанавливает значение и уведомляет подписчиков асинхронно."""
        self._data[key] = value
        self._timestamps[key] = time.time()
        logger.debug(f"Установлено: {key} = {value}")
        asyncloop = asyncio.get_running_loop()
        asyncloop.create_task(self._notify_subscribers(key=key, value=value))
        

    async def set_async(self, key: str, value: T) -> None:
        """Синхронно устанавливает значение и уведомляет подписчиков асинхронно."""
        self._data[key] = value
        self._timestamps[key] = time.time()
        logger.debug(f"Установлено: {key} = {value}")
        await self._notify_subscribers(key=key, value=value)


    def get(self, key: str, default=None):
        value = self._data.get(key, default)
        logger.debug(f"Получено: {key} = {value}")
        return value

    def get_all(self):
        return self._data

    def get_all_data(self) -> List[T]:
        """Возвращает список значений."""
        return list(self._data.values())

    def get_last_modified(self, key: str):
        timestamp = self._timestamps.get(key, None)
        logger.debug(f"Последнее изменение {key}: {timestamp}")
        return timestamp

    def delete(self, key: str) -> None:
        if key in self._data:
            del self._data[key]
            del self._timestamps[key]
            logger.info(f"Удалено: {key}")
        if key in self._subscribers:
            del self._subscribers[key]

    def subscribe(self, key: str, sub_id: str, callback: Callable[[str, T], Awaitable[None]]) -> None:
        """Подписка на изменения конкретного ключа."""
        if key not in self._subscribers:
            self._subscribers[key] = {}
        self._subscribers[key][sub_id] = callback
        logger.info(f"Подписка добавлена: {sub_id} на {key}")

    def unsubscribe(self, key: str, sub_id: str) -> None:
        """Отмена подписки на конкретный ключ."""
        if key in self._subscribers and sub_id in self._subscribers[key]:
            del self._subscribers[key][sub_id]
            logger.info(f"Подписка удалена: {sub_id} с {key}")
            if not self._subscribers[key]:  # Удаляем пустой словарь
                del self._subscribers[key]

    def subscribe_all(self, sub_id: str, callback: Callable[[str, T], Awaitable[None]]) -> None:
        """Подписка на все изменения в словаре."""
        self._global_subscribers[sub_id] = callback
        logger.info(f"Глобальная подписка добавлена: {sub_id}")

    def unsubscribe_all(self, sub_id: str) -> None:
        """Отмена глобальной подписки."""
        if sub_id in self._global_subscribers:
            del self._global_subscribers[sub_id]
            logger.info(f"Глобальная подписка удалена: {sub_id}")

    def json(self):
        return json.dumps(self.get_all(), default=lambda o: o.json())
                
servicesDataPoll = ObservableDict[ObservableDict]()