from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Any, List, Union, Literal
from app.ingternal.device.serialize_model.create import add_device
from app.ingternal.device.serialize_model.delete import delete_device
from app.ingternal.device.serialize_model.update import edit_status_device
from app.ingternal.logs import get_base_logger
from contextlib import suppress
import asyncio

logger = get_base_logger.get_logger(__name__)

class Types(str, Enum):
	ADD = "add"
	DELETE = "delete"
	STATUS = "status"

class DeviceAddQueueSchema(BaseModel):
	type: Literal[Types.ADD]  # Фиксируем только ADD тип
	object: Any
	
	model_config = ConfigDict(
		use_enum_values=True,
		arbitrary_types_allowed=True
	)

class DeviceDeleteQueueSchema(BaseModel):
	type: Literal[Types.DELETE]  # Фиксируем только DELETE тип
	system_name: str
	
	model_config = ConfigDict(
		use_enum_values=True
	)

class DeviceStatusQueueSchema(BaseModel):
	type: Literal[Types.STATUS]  # Фиксируем только DELETE тип
	system_name: str
	status: bool
	
	model_config = ConfigDict(
		use_enum_values=True
	)

# Явно перестраиваем модели для Pydantic
DeviceAddQueueSchema.model_rebuild()
DeviceDeleteQueueSchema.model_rebuild()

class DeviceQueue:
	queue: List[Union[DeviceAddQueueSchema, DeviceDeleteQueueSchema, DeviceStatusQueueSchema]] = []
	
	@classmethod
	def add(cls, type: Types, key,  value) -> None:
		"""Добавляет элемент в очередь с валидацией и логированием"""
		try:
			logger.debug(f"Adding item to queue. Type: {type}, Object: {value}")
			
			if type == Types.ADD:
				item = DeviceAddQueueSchema(type=type, object=value)
				cls.queue.append(item)
				logger.info(f"Added device to queue. Model: {getattr(value, 'name', 'Unknown')}")
				
			elif type == Types.DELETE:
				item = DeviceDeleteQueueSchema(type=type, system_name=value)
				cls.queue.append(item)
				logger.info(f"Added deletion task to queue. System name: {value}")
			
			elif type == Types.STATUS:
				item = DeviceStatusQueueSchema(type=type, system_name=key, status=value)
				cls.queue.append(item)
				logger.info(f"Added deletion task to queue. System name: {value}")
				
			else:
				raise ValueError(f"Unknown type: {type}")
				
			logger.debug(f"Current queue size: {len(cls.queue)}")
			
		except Exception as e:
			logger.error(f"Failed to add item to queue: {e}", exc_info=True)
			raise

	@classmethod
	async def start(cls) -> bool:
		"""Обрабатывает очередь с подробным логированием и обработкой ошибок"""
		logger.info(f"Starting queue processing. Items in queue: {len(cls.queue)}")
		
		if not cls.queue:
			logger.info("Queue is empty, nothing to process")
			return True

		success = True
		processed_items = 0
		
		try:
			for idx, item in enumerate(list(cls.queue)):  # Создаем копию для итерации
				try:
					logger.debug(f"Processing item {idx + 1}/{len(cls.queue)}: {item}")
					
					if item.type == Types.ADD:
						logger.info(f"Adding device: {item.object}")
						await add_device(item.object)
						logger.debug("Device added successfully")
						
					elif item.type == Types.DELETE:
						logger.info(f"Deleting device: {item.system_name}")
						await delete_device(item.system_name)
						logger.debug("Device deleted successfully")

					elif item.type == Types.STATUS:
						logger.info(f"Deleting device: {item.system_name}")
						await edit_status_device(item.system_name, item.status)
						logger.debug("Device update status successfully")
					
					processed_items += 1
					
				except asyncio.CancelledError:
					logger.warning("Queue processing cancelled during operation")
					success = False
					raise
					
				except Exception as e:
					logger.error(f"Failed to process item {idx + 1}: {e}", exc_info=True)
					success = False
					continue

			return success
			
		finally:
			# Очищаем только успешно обработанные элементы
			with suppress(Exception):
				if success:
					cls.queue.clear()
					logger.info("Queue cleared successfully")
				else:
					cls.queue = cls.queue[processed_items:]
					logger.warning(f"Queue partially processed. Remaining items: {len(cls.queue)}")

			logger.info(f"Queue processing completed. Success: {success}")