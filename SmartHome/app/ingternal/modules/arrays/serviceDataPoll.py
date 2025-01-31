

# def look_for_name(arr:List[DeviceSerializeFieldSchema], name:str)->DeviceSerializeFieldSchema|None:
# 	for item in arr:
# 		if(item.name == name):
# 			return(item)
# 	return None

# def replace_value_in_field(arr:List[DeviceSerializeFieldSchema], name:str, value):
# 	field_index = None
# 	for index, item in enumerate(arr):
# 		if(item.name == name):
# 			field_index = index
# 	if field_index != None:
# 		arr[field_index].value = value
# 	return arr



# class DevicesDataArrey():
# 	devices_data:List[DevicesDataArreyItem] = []
# 	actual: bool = False

# 	@classmethod
# 	def add(cls, device:DeviceSchema):
# 		for item in cls.devices_data:
# 			if(item.system_name==device.system_name):
# 				return None
# 		cls.devices_data.append(DevicesDataArreyItem(system_name=device.system_name, device=device, time_update=datetime.now()))
# 		return cls.devices_data

# 	@classmethod
# 	def add_or_updata(cls, device:DeviceSchema):
# 		index_device:int | None = None
# 		for index, item in enumerate(cls.devices_data):
# 			if(item.system_name==device.system_name):
# 				index_device = index
# 				break
# 		if index_device != None:
# 			cls.devices_data[index_device] = DevicesDataArreyItem(system_name=device.system_name, device=device, time_update=datetime.now())
# 		else:
# 			cls.devices_data.append(DevicesDataArreyItem(system_name=device.system_name, device=device, time_update=datetime.now()))
# 		return cls.devices_data
	
# 	@classmethod
# 	def updata_value(cls, system_name, field_name, value):
# 		data = cls.get(system_name)
# 		data:DeviceSchema = data.device
# 		fields = replace_value_in_field(data.fields, field_name, value)
# 		data.value[field_name] = value
# 		cls.add_or_updata(data)

# 	@classmethod
# 	def all(cls):
# 		return cls.devices_data

# 	@classmethod
# 	def get_all_device(cls)->List[DeviceSchema]:
# 		return [x.device for x in cls.devices_data]

# 	@classmethod
# 	def delete(cls, system_name:str):
# 		try:
# 			for item in cls.devices_data:
# 				if(item.system_name==system_name):
# 					ret = item
# 					cls.devices_data.pop(cls.devices_data.index(item))
# 					return ret
# 			return None
# 		except Exception as e:
# 			logger.error(f"delete device from device list. {e}")
# 			return None

# 	@classmethod
# 	def get(cls, system_name:str)->DevicesDataArreyItem|None:
# 		for item in cls.devices_data:
# 			if(item.system_name==system_name):
# 				return item
# 		return None

# from typing import Callable, Dict, List, Any
# import time
# import logging

# logger = logging.getLogger(__name__)
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# class ObservableDict:
#     def __init__(self):
#         self._data = {}
#         self._timestamps = {}
#         self._subscribers: Dict[str, Dict[str, Callable[[str, any], None]]] = {}
#         logger.info("ObservableDict инициализирован")

#     def set(self, key, value):
#         self._data[key] = value
#         self._timestamps[key] = time.time()
#         logger.info(f"Установлено: {key} = {value}")
#         if key in self._subscribers:
#             for callback in self._subscribers[key].values():
#                 callback(key, value)

#     def get(self, key, default=None):
#         value = self._data.get(key, default)
#         logger.info(f"Получено: {key} = {value}")
#         return value
    
#     def get_all(self):
#         return self._data
    
#     def values(self) -> List[Any]:
#         """Возвращает список."""
#         return list(self._data.values())

#     def get_last_modified(self, key):
#         timestamp = self._timestamps.get(key, None)
#         logger.info(f"Последнее изменение {key}: {timestamp}")
#         return timestamp

#     def delete(self, key):
#         if key in self._data:
#             del self._data[key]
#             del self._timestamps[key]
#             logger.info(f"Удалено: {key}")
#         if key in self._subscribers:
#             del self._subscribers[key]

#     def subscribe(self, key, sub_id: str, callback: Callable[[str, any], None]):
#         if key not in self._subscribers:
#             self._subscribers[key] = {}
#         self._subscribers[key][sub_id] = callback
#         logger.info(f"Подписка добавлена: {sub_id} на {key}")

#     def unsubscribe(self, key, sub_id: str):
#         if key in self._subscribers and sub_id in self._subscribers[key]:
#             del self._subscribers[key][sub_id]
#             logger.info(f"Подписка удалена: {sub_id} с {key}")
#             if not self._subscribers[key]:
#                 del self._subscribers[key]

from typing import Callable, Dict, List, Any, Awaitable
import time
import logging
import asyncio

logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format="%(filename)s: %(asctime)s - %(levelname)s - %(message)s"
)


class ObservableDict:
    def __init__(self):
        self._data = {}
        self._timestamps = {}
        self._subscribers: Dict[str, Dict[str, Callable[[str, Any], Awaitable[None]]]] = {}
        self._global_subscribers: Dict[str, Callable[[str, Any], Awaitable[None]]] = {}
        logger.info("ObservableDict инициализирован")

    async def _notify_subscribers(self, key: str, value: Any):
        
        # Уведомляем подписчиков ключа
        if key in self._subscribers:
            for callback in self._subscribers[key].values():
                await callback(key, value)
        
        # Уведомляем глобальных подписчиков
        for callback in self._global_subscribers.values():
            await callback(key, value)

    def set(self, key: str, value: Any) -> None:
        """Синхронно устанавливает значение и уведомляет подписчиков асинхронно."""
        self._data[key] = value
        self._timestamps[key] = time.time()
        logger.info(f"Установлено: {key} = {value}")
        asyncloop = asyncio.get_running_loop()
        asyncloop.create_task(self._notify_subscribers(key, value))
        

    async def set_async(self, key: str, value: Any) -> None:
        """Синхронно устанавливает значение и уведомляет подписчиков асинхронно."""
        self._data[key] = value
        self._timestamps[key] = time.time()
        logger.info(f"Установлено: {key} = {value}")
        await self._notify_subscribers(key, value)


    def get(self, key: str, default=None):
        value = self._data.get(key, default)
        logger.info(f"Получено: {key} = {value}")
        return value

    def get_all(self):
        return self._data

    def get_all_data(self) -> List[Any]:
        """Возвращает список значений."""
        return list(self._data.values())

    def get_last_modified(self, key: str):
        timestamp = self._timestamps.get(key, None)
        logger.info(f"Последнее изменение {key}: {timestamp}")
        return timestamp

    def delete(self, key: str) -> None:
        if key in self._data:
            del self._data[key]
            del self._timestamps[key]
            logger.info(f"Удалено: {key}")
        if key in self._subscribers:
            del self._subscribers[key]

    def subscribe(self, key: str, sub_id: str, callback: Callable[[str, Any], Awaitable[None]]) -> None:
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

    def subscribe_all(self, sub_id: str, callback: Callable[[str, Any], Awaitable[None]]) -> None:
        """Подписка на все изменения в словаре."""
        self._global_subscribers[sub_id] = callback
        logger.info(f"Глобальная подписка добавлена: {sub_id}")

    def unsubscribe_all(self, sub_id: str) -> None:
        """Отмена глобальной подписки."""
        if sub_id in self._global_subscribers:
            del self._global_subscribers[sub_id]
            logger.info(f"Глобальная подписка удалена: {sub_id}")
                
servicesDataPoll = ObservableDict()