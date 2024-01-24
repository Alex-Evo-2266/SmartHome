import ormar, datetime
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import BaseMeta
from typing import Optional, List, Dict, Union
from app.ingternal.automation.enums import TypeEntityTrigger, Condition, Sign, TypeEntityCondition, TypeEntityAction

class Automation(ormar.Model):
	class Meta(BaseMeta):
		pass
	
	system_name: str = ormar.String(max_length=200, primary_key=True)
	name: str = ormar.String(max_length=200)
	condition: Condition = ormar.String(max_length=200, default=Condition.OR)
	status: bool = ormar.Boolean(default=True)

class Automation_trigger(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityTrigger = ormar.String(max_length=200, default=TypeEntityTrigger.DEVICE)
	entity: str = ormar.String(max_length=300)
	automation: Optional[Union[Automation, Dict]] = ormar.ForeignKey(Automation, related_name="triggers", ondelete=ReferentialAction.CASCADE)


class Automation_condition(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityCondition = ormar.String(max_length=200, default=TypeEntityCondition.DEVICE)
	entity: str = ormar.String(max_length=300)
	sign: Sign = ormar.String(max_length=200, default=Sign.EQUALLY)
	value: str = ormar.String(max_length=1000)
	automation: Optional[Union[Automation, Dict]] = ormar.ForeignKey(Automation, related_name="conditions", ondelete=ReferentialAction.CASCADE)

class Automation_action(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityAction = ormar.String(max_length=200, default=TypeEntityAction.DEVICE)
	entity: str = ormar.String(max_length=300)
	value: str = ormar.String(max_length=1000)
	automation: Optional[Union[Automation, Dict]] = ormar.ForeignKey(Automation, related_name="actions", ondelete=ReferentialAction.CASCADE)



class Automation_action_else(ormar.Model):
	class Meta(BaseMeta):
		pass

	id: int = ormar.Integer(primary_key=True, autoincrement=True)
	type_entity: TypeEntityAction = ormar.String(max_length=200, default=TypeEntityAction.DEVICE)
	entity: str = ormar.String(max_length=300)
	value: str = ormar.String(max_length=1000)
	automation: Optional[Union[Automation, Dict]] = ormar.ForeignKey(Automation, related_name="else", ondelete=ReferentialAction.CASCADE)