from enum import Enum

class ConditionType(str, Enum):
	AND = "and"
	OR = "or"

class SetType(str, Enum):
	DATA = "data"
	COMMAND = "command"

class Operation(str, Enum):
	MORE = ">"
	LESS = "<"
	MORE_OR_EQUAL = ">="
	LESS_OR_EQUAL = "<="
	EQUAL = "=="
	NOT_EQUAL = "!="
