from pydantic import BaseModel
from enum import Enum
from typing import Callable, List, Dict
from .utils.file import writeYMLFile, readYMLFile, create_file

class ConfigItemType(str, Enum):
	NUMBER = "number"
	TEXT = "text"
	PASSWORD = "password"

class ConfigItem(BaseModel):
	class Config:  
		use_enum_values = True

	key: str
	value: str
	type: ConfigItemType
	tag: str = 'base'

def filter_delete(key:str):
	def _filter_delete(data:ConfigItem):
		return key != data.key
	return _filter_delete

def delete_value(item: ConfigItem):
	return ConfigItem(key=item.key, tag=item.tag, type=item.type, value=str(len(item.value)))

class Config():

	def __init__(self, dir:str, file_name:str = 'service_config'):
		self.callback:Dict[str, Callable] = {}
		self.config: List[ConfigItem] = []
		self.file = create_file(dir, file_name)

	def __parse_conf(self):
		return [x.dict() for x in self.config]

	def get(self, key: str):
		for item in self.config:
			if key == item.key:
				return item
	
	def register_config(self, data: ConfigItem, callback:Callable | None = None):
		if self.get(data.key):
			return
		self.config.append(data)
		if callback:
			self.callback[data.key] = callback

	async def set(self, key: str, value: str):
		for item in self.config:
			if key == item.key:
				item.value = value
				if key in self.callback:
					await self.callback[key]()
				break

	async def restart(self):
		for key in self.callback:
			await self.callback[key]()

	async def set_and_save(self, key: str, value: str):
		await self.set(key, value)
		self.save()

	async def set_dict(self, data: Dict[str, str]):
		for key in data:
			await self.set(key, data[key])
			
	def delete(self, key: str):
		self.config = list(filter(filter_delete(key), self.config))
		self.callback.pop(key, None)

	def get_all_data(self):
		data = []
		for item in self.config:
			if item.type == ConfigItemType.PASSWORD:
				data.append(delete_value(item))
			else:
				data.append(ConfigItem(**(item.dict())))
		return data
	
	def get_all_raw(self):
		return self.config

	def save(self):
		writeYMLFile(self.file, self.__parse_conf())

	async def load(self):
		data = readYMLFile(self.file)
		if not data:
			return
		for item in data:
			item_data = ConfigItem(**item)
			if self.get(item_data.key):
				await self.set(item_data.key, item_data.value)