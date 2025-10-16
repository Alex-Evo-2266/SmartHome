from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ContaiderConfig(BaseModel):
	build: Optional[Dict[str, Any]]
	command: str
	restart: str
	environment: Dict[str, Any]
	labels: List[str]
	volumes: List[str]

class ContaiderData(BaseModel):
	name: str
	config: ContaiderConfig

class ModulesConf(BaseModel):
	name: str
	name_module: str
	multiply: bool
	containers: List[ContaiderData]

class ModulesLoadData(BaseModel):
	name: str
	path: Optional[str]

class ModulesConfAndLoad(ModulesConf):
	load: bool = False
	load_module_name: List[ModulesLoadData] = []

class ModuleData(BaseModel):
	module: str
	exemle: str
	path: str
	config: ModulesConf