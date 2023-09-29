
from enum import Enum

class Received_Data_Format(str, Enum):
	JSON = "json"
	STRING = "string"
	
class Status_Device(str, Enum):
	ONLINE = "online"
	OFFLINE = "offline"
	NOT_SUPPORTED = "not_supported"
	UNLINC = "unlinc"

class Type_device_field(str, Enum):
	BINARY = "binary"
	NUMBER = "number"
	TEXT = "text"
	ENUM = "enum"

