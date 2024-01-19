from typing import Dict
import yaml, logging, os
from typing import Callable

logger = logging.getLogger(__name__)

class ModuleConfig(object):

	def __init__(self, file):
		self.callbacks = {}
		self.file = file
		self.config = {}

	def __read_config(self):
		try:
			templates = None
			self.__create_config()
			with open(self.file) as f:
				templates = yaml.safe_load(f)
			if not templates:
				self.config = dict()
				return self.config
			self.config = templates
			return templates
		except FileNotFoundError as e:
			logger.error(f"file not found. file:{self.file}")
			raise

	def __write_config(self, templates: dict):
		self.config = templates
		with open(self.file, 'w') as f:
			yaml.dump(templates, f, default_flow_style=False)

	def __create_config(self):
		if not os.path.exists(self.file):
			file = open(self.file, "w+")
			file.close()

	def register_config(self, name: str, data: Dict[str, str], callback: Callable = None):
		templates = self.__read_config()
		if(templates == None):
			return
		block = dict()
		if name in templates:
			block = templates[name]
		for key in data:
			if key not in block:
				block[key] = data[key]
		templates[name] = block
		self.__write_config(templates)
		if callback:
			self.callbacks[name] = callback

	def remove_config(self, name: str):
		self.callbacks.pop(name, None)
		templates = self.__read_config()
		templates.pop(name, None)
		self.__write_config(templates)

	def get_config(self, name: str)->Dict[str, str] | None:
		if name in self.config:
			return self.config[name]
		templates = self.__read_config()
		if name in templates:
			return templates[name]
		return None
	
	async def set_config(self, name:str, data: Dict[str, str]):
		templates = self.__read_config()
		block = templates[name]
		if not block:
			block = dict()
		for key in block:
			if not (key in data):
				data[key] = block[key]
		templates[name] = data
		self.__write_config(templates)
		if name in self.callbacks:
			f = self.callbacks[name]
			try:
				await f()
			except Exception as e:
				logger.error(f"error start callback function: {name}")

	def all(self)->Dict[str, Dict[str, str]]:
		templates = self.__read_config()
		return templates
	
	async def restart_all(self):
		for key in self.callbacks:
			f = self.callbacks[key]
			await f()