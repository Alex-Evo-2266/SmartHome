
from enum import Enum

class ReceivedDataFormat(str, Enum):
	JSON = "json"
	STRING = "string"
	
class StatusDevice(str, Enum):
	ONLINE = "online"
	OFFLINE = "offline"
	NOT_SUPPORTED = "not_supported"
	UNLINC = "unlinc"

class TypeDeviceField(str, Enum):
	BINARY = "binary"
	NUMBER = "number"
	TEXT = "text"
	ENUM = "enum"
	BASE = "base"
	COUNTER = "counter"
