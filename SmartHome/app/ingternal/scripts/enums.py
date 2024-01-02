
from enum import Enum

class TypeEntity(str, Enum):
	DEVICE = "device"
	TIME = "time"
	SERVICE = "service"
	PERIOD = "period"

class TypeEntityAction(str, Enum):
	DEVICE = "device"
	SERVICE = "service"
	SCRIPT = "script"
	DELAY = "delay"

class TypeEntityCondition(str, Enum):
	DEVICE = "device"
	SERVICE = "service"
	TIME = "time"
	
class Condition(str, Enum):
	AND = "and"
	OR = "or"
	
class Sign(str, Enum):
	EQUALLY = "equally"
	MORE = "more"
	LESS = "less"