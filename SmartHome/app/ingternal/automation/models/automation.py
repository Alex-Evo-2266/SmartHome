import ormar
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional
from app.ingternal.automation.schemas.enums import ConditionType
from app.ingternal.automation.schemas.enums import Operation, SetType


class Automation(ormar.Model):
	ormar_config = base_ormar_config.copy()

	name:str = ormar.String(primary_key=True, max_length=200)
	condition_type: ConditionType = ormar.Enum(enum_class=ConditionType, default=ConditionType.AND)
	is_enabled: bool = ormar.Boolean(default=True)

class TargetItem(ormar.Model):
	ormar_config = base_ormar_config.copy()
	
	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	service: str = ormar.String(max_length=200)
	trigger: str = ormar.String(max_length=400)
	option:str = ormar.String(max_length=200, default="")
	automation: Optional[Automation] = ormar.ForeignKey(Automation, related_name="triggers", ondelete=ReferentialAction.CASCADE)
	
class ConditionItem(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	operation: Operation = ormar.String(max_length=10, default=Operation.EQUAL)
	arg1_service: str = ormar.String(max_length=200)
	arg1: str = ormar.String(max_length=500,default="")
	arg2_service: str = ormar.String(max_length=200)
	arg2: str = ormar.String(max_length=500,default="")
	automation: Optional[Automation] = ormar.ForeignKey(Automation, related_name="conditions", ondelete=ReferentialAction.CASCADE)

class ActionItem(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	index: int = ormar.Integer()
	service: str = ormar.String(max_length=200)
	action: str = ormar.String(max_length=200)
	data: str = ormar.String(max_length=400)
	type_set: SetType = ormar.String(max_length=10, default=SetType.DATA)
	automation: Optional[Automation] = ormar.ForeignKey(Automation, related_name="actions", ondelete=ReferentialAction.CASCADE)

class ActionElseItem(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	index: int = ormar.Integer()
	service: str = ormar.String(max_length=200)
	object: str = ormar.String(max_length=200,default="")
	field: str = ormar.String(max_length=200)
	data: str = ormar.String(max_length=400)
	type_set: SetType = ormar.String(max_length=10, default=SetType.DATA)
	automation: Optional[Automation] = ormar.ForeignKey(Automation, related_name="else_branch", ondelete=ReferentialAction.CASCADE)
