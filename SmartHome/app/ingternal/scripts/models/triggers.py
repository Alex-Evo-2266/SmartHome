import ormar, datetime
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import BaseMeta
from typing import Optional, List, Dict, Union
from app.ingternal.scripts.enums import TypeEntity, Condition, Sign, TypeEntityCondition, TypeEntityAction

class Trigger(ormar.Model):
	class Meta(BaseMeta):
		pass
	
	system_name: str = ormar.String(max_length=200, primary_key=True)
	name: str = ormar.String(max_length=200)
	condition: Condition = ormar.String(max_length=200, default=Condition.OR)
	status: bool = ormar.Boolean(default=True)

class Trigger_entity(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntity = ormar.String(max_length=200, default=TypeEntity.DEVICE)
	entity: str = ormar.String(max_length=300)
	trigger: Optional[Union[Trigger, Dict]] = ormar.ForeignKey(Trigger, related_name="entities", ondelete=ReferentialAction.CASCADE)


class Trigger_condition(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityCondition = ormar.String(max_length=200, default=TypeEntityCondition.DEVICE)
	entity: str = ormar.String(max_length=300)
	sign: Sign = ormar.String(max_length=200, default=Sign.EQUALLY)
	value: str = ormar.String(max_length=1000)
	trigger: Optional[Union[Trigger, Dict]] = ormar.ForeignKey(Trigger, related_name="conditions", ondelete=ReferentialAction.CASCADE)

class Trigger_action(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityAction = ormar.String(max_length=200, default=TypeEntityAction.DEVICE)
	entity: str = ormar.String(max_length=300)
	value: str = ormar.String(max_length=1000)
	trigger: Optional[Union[Trigger, Dict]] = ormar.ForeignKey(Trigger, related_name="actions", ondelete=ReferentialAction.CASCADE)



class Trigger_action_differently(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityAction = ormar.String(max_length=200, default=TypeEntityAction.DEVICE)
	entity: str = ormar.String(max_length=300)
	value: str = ormar.String(max_length=1000)
	trigger: Optional[Union[Trigger, Dict]] = ormar.ForeignKey(Trigger, related_name="differently", ondelete=ReferentialAction.CASCADE)