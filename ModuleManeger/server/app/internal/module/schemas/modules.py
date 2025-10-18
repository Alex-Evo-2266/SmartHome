from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ContainerStatus(BaseModel):
	name: str
	state: str
	status: str

class ExemplStatus(BaseModel):
	containers: List[ContainerStatus]
	all_running: bool

# class ContaiderConfig(BaseModel):
# 	build: Optional[Dict[str, Any]] = None
# 	command: Optional[str] = None
# 	restart: str = ""
# 	environment: Dict[str, Any] = {}
# 	labels: List[str] = []
# 	volumes: List[str] = []

class ContaiderData(BaseModel):
	name: str
	config: Dict[str, Any]

class ModulesConf(BaseModel):
	name: str
	name_module: str
	multiply: bool
	containers: List[ContaiderData]

class ModulesLoadData(BaseModel):
	name: str
	path: Optional[str]
	status: Optional[ExemplStatus] = None

class ModulesConfAndLoad(ModulesConf):
	repo: Optional[str] = None
	local: bool = False
	load: bool = False
	load_module_name: List[ModulesLoadData] = []

class ModuleData(BaseModel):
	module: str
	exemle: str
	path: str
	config: ModulesConf

class AllModulesResData(BaseModel):
	data: List[ModulesConfAndLoad]