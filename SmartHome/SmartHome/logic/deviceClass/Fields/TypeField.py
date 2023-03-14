

from enum import Enum

class TypeField(str, Enum):
	BASE = "base"
	NUMDER = "number"
	BINARY = "binary"
	TEXT = "text"
	ENUM = "enum"
	COUNTER = "counter"
