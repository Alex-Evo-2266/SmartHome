
from enum import Enum

class ScriptNodeType(str, Enum):
	TRIGGER = "trigger"
	CONDITION = "condition"
	ACTION = "action"