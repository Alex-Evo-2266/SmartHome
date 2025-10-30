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
	containers: Optional[List[ContaiderData]] = None
	type: str
	dependencies: Optional[List[str]] = None

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

class ContainerId(BaseModel):
	container_id: str
	name: str
	service: str

class Containers(BaseModel):
	data: List[ContainerId]

class RebuildData(BaseModel):
	service: str
	name: str