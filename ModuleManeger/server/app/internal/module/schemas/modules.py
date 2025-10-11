from pydantic import BaseModel
from typing import List, Optional

class ContaiderConfig(BaseModel):
	restart: str
	ports: List[str]
	volumes: List[str]
	labels: List[str]
	depends_on: List[str]

class ContaiderData(BaseModel):
	name: str
	config: ContaiderConfig

class ModulesConf(BaseModel):
	name: str
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
	path: str
	config: ModulesConf