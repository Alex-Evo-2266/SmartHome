# import logging
# from pydantic import BaseModel
# from typing import Dict, Tuple, List
# from app.ingternal.room.schemas.room import RoomDevicesRaw
# from app.ingternal.room.schemas.type_device import DeviceFieldType, TypeDeviceField
# from app.ingternal.room.serialize_model.get_room import get_room_all

# logger = logging.getLogger(__name__)

# class RoomArrayValueItem(BaseModel):
# 	value: str
# 	values: Dict[Tuple[str, str], str]

# class RoomArrayItem(BaseModel):
# 	room: RoomDevicesRaw
# 	values: Dict[Tuple[str, str], RoomArrayValueItem]

# class RoomArray():
# 	rooms:Dict[str, RoomArrayItem] = {}
# 	device_mapper: Dict[Tuple[str, str], List[Tuple[str, str, str]]] = {}

# 	@staticmethod
# 	def _build_device_index(room: RoomDevicesRaw, data:Dict[Tuple[str, str], List[Tuple[str, str, str]]]) -> Dict[Tuple[str, str], List[Tuple[str, str, str]]]:
# 		"""
# 		Строит словарь:
# 		ключ = (system_name, id_field_device)
# 		значение = (room_name, device_type_name, field_name)
# 		"""
# 		index: Dict[Tuple[str, str], List[Tuple[str, str, str]]] = data

# 		if not room.device_room:
# 			return index  # если устройств нет — вернуть пустой словарь

# 		for device_type_name, device_type_model in room.device_room.items():
# 			# device_type_name — тип устройства внутри комнаты (ключ словаря device_room)
# 			for field_name, field_type in device_type_model.fields.items():
# 				# field_name — поле внутри типа устройства в комнате (ключ словаря fields)
# 				for device_field in field_type.devices:
# 					# device_field — объект DeviceField (system_name + id_field_device)
# 					key = (device_field.system_name, device_field.id_field_device)
# 					value = (room.name_room, device_type_name, field_name)
# 					if not key in index:
# 						index[key] = list()
# 					index[key].append(value)

# 		return index

# 	@staticmethod
# 	def _default_data(type_field:DeviceFieldType):
# 		if type_field == TypeDeviceField.BINARY:
# 			return "false"
# 		elif type_field in [TypeDeviceField.NUMBER, TypeDeviceField.COUNTER]:
# 			return "0"
# 		return ""

# 	@classmethod
# 	def add_room(cls, room:RoomDevicesRaw):
# 		vals:Dict[Tuple[str, str], RoomArrayValueItem] = {}
# 		for type_device, device in room.device_room.items():
# 			for field_name, field in device.fields.items():
# 				key = (type_device, field_name)
# 				vals[key] = RoomArrayValueItem(value=RoomArray._default_data(field.field_type), values={})
# 		cls.rooms[room.name_room] = RoomArrayItem(room=room, values=vals)
# 		cls.device_mapper = RoomArray._build_device_index(room, cls.device_mapper)

# 	@classmethod
# 	def all(cls):
# 		return cls.rooms
	
# 	@classmethod
# 	def get_mapper_arr(cls):
# 		return [{"key":key, "data":data} for key, data in cls.device_mapper.items()]

# 	@classmethod
# 	def delete(cls, room_name: str):
# 		"""Удаляет комнату и возвращает её, если была."""
# 		try:
# 			return cls.rooms.pop(room_name, None)
# 		except Exception as e:
# 			logger.error(f"Ошибка при удалении комнаты {room_name}: {e}")
# 			return None

# 	@classmethod
# 	def get(cls, room_name:str)->RoomArrayItem|None:
# 		return cls.rooms.get(room_name, None)
	
# 	@classmethod
# 	def get_value(cls, room_name:str, dev: str, field:str)->str|None:
# 		try:
# 			room = cls.rooms.get(room_name, None)
# 			if room is None:
# 				return None
# 			key = (dev, field)
# 			return room.values[key].value
# 		except Exception as e:
# 			logger.warning(e)
# 			return None
		
# 	@classmethod
# 	def get_value_and_type(cls, room_name:str, dev: str, field:str):
# 		try:
# 			room = cls.rooms.get(room_name, None)
# 			if room is None:
# 				return (None, None)
# 			key = (dev, field)
# 			room_data:RoomDevicesRaw = room.room
# 			type_f = room_data.device_room[dev].fields[field].field_type
# 			return (room.values[key].value, type_f)
# 		except Exception as e:
# 			logger.warning(e)
# 			return (None, None)

# 	@classmethod
# 	def update_room(cls, system_name: str, field_id: str, value: str):
# 		try:
# 			key = (system_name, field_id)
# 			if key not in cls.device_mapper:
# 				return

# 			for room_name, device_type, field_name in cls.device_mapper[key]:
# 				room_data: RoomDevicesRaw = cls.rooms[room_name].room
# 				type_f = room_data.device_room[device_type].fields[field_name].field_type
# 				key_room_dev = (device_type, field_name)

# 				# обновляем конкретное устройство
# 				cls.rooms[room_name].values[key_room_dev].values[key] = value

# 				# пересчитываем агрегированное значение
# 				values = cls.rooms[room_name].values[key_room_dev].values.values()
# 				if type_f == TypeDeviceField.BINARY:
# 					cls.rooms[room_name].values[key_room_dev].value = "true" if "true" in values else "false"
# 				elif type_f == TypeDeviceField.NUMBER:
# 					cls.rooms[room_name].values[key_room_dev].value = str(min(int(x) for x in values))
# 				else:
# 					cls.rooms[room_name].values[key_room_dev].value = value
# 		except Exception as e:
# 			logger.error(e)

# 	@staticmethod
# 	async def init_rooms():
# 		rooms = await get_room_all()
# 		for room in rooms:
# 			RoomArray.add_room(room)