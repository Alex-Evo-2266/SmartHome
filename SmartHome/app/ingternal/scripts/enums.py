
from enum import Enum

class TypeEntity(str, Enum):
	DEVICE = "device"
	TIME = "time"
	SERVICE = "service"
	PERIOD = "period"
	
class Condition(str, Enum):
	AND = "and"
	OR = "or"
	
class Sign(str, Enum):
	EQUALLY = "equally"
	MORE = "more"
	LESS = "less"