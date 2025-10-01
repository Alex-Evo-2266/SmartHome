from pydantic import BaseModel
from enum import Enum
from typing import List

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