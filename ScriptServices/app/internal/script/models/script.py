import ormar, uuid, datetime
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional, Dict, Union
from app.internal.script.schemas.enum import ScriptNodeType

class Script(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(primary_key=True, max_length=200)
	name: str = ormar.String(max_length=200)
	description: Optional[str] = ormar.String(max_length=500, nullable=True)
	is_active: bool = ormar.Boolean(default=True)
	created_at: datetime.datetime = ormar.DateTime(default=datetime.datetime.utcnow)
	updated_at: datetime.datetime = ormar.DateTime(default=datetime.datetime.utcnow)


class ScriptNode(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(primary_key=True, max_length=200)
	script: Script = ormar.ForeignKey(Script, related_name="nodes")

	type: ScriptNodeType = ormar.String(max_length=20, default=ScriptNodeType.ACTION)  # 'trigger', 'condition', 'action'
	expression: str = ormar.Text()  # строка, исполняемая интерпретатором
	description: Optional[str] = ormar.Text(nullable=True)

	# UI-позиция (опционально)
	x: Optional[int] = ormar.Integer(nullable=True)
	y: Optional[int] = ormar.Integer(nullable=True)

class ScriptEdge(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(primary_key=True, max_length=200)
	script: Script = ormar.ForeignKey(Script, related_name="edges")

	source_node: ScriptNode = ormar.ForeignKey(ScriptNode, related_name="out_edges")
	target_node: ScriptNode = ormar.ForeignKey(ScriptNode, related_name="in_edges")

	condition_label: Optional[str] = ormar.String(max_length=50, nullable=True)
