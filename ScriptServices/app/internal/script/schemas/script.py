from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
import datetime
from app.internal.script.schemas.enum import ScriptNodeType
		
class ScriptNode(BaseModel):
	id: str 

	type: ScriptNodeType
	expression: str
	description: Optional[str] = None

	# UI-позиция (опционально)
	x: Optional[int] = None
	y: Optional[int] = None

	class Config:  
		use_enum_values = True
				
class ScriptEdge(BaseModel):
	id: str 

	id_start: str
	id_end: str
	condition_label:str

	class Config:  
		use_enum_values = True

class ScriptSerialize(BaseModel):
	id: str
	name: str
	description: Optional[str] = None
	is_active: bool
	created_at: datetime.datetime
	updated_at: datetime.datetime
	nods: List[ScriptNode]
	edgs: List[ScriptEdge]
	
	class Config:  
		use_enum_values = True
		
class ScriptSerializeList(BaseModel):
	scripts: List[ScriptSerialize]

class ScriptNodeCreate(BaseModel):
	id: str
	type: ScriptNodeType
	expression: str
	description: Optional[str] = None

	# UI-позиция (опционально)
	x: Optional[int] = None
	y: Optional[int] = None

	class Config:  
		use_enum_values = True
				
class ScriptEdgeCreate(BaseModel):
	id_start: str
	id_end: str
	condition_label:str

	class Config:  
		use_enum_values = True

class ScriptSerializeCreate(BaseModel):
	name: str
	description: Optional[str] = None
	nods: List[ScriptNodeCreate]
	edgs: List[ScriptEdgeCreate]
	
	class Config:  
		use_enum_values = True

class ScriptSerializeUpdate(ScriptSerializeCreate):
	id: str
	is_active: bool
	
	class Config:  
		use_enum_values = True

class CheckText(BaseModel):
	text: str

class CheckResult(BaseModel):
	result: bool
	message: Optional[str] = None
	index: Optional[int] = None
	
	class Config:  
		use_enum_values = True

