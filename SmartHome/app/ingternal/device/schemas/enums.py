
from enum import Enum

class ReceivedDataFormat(str, Enum):
	JSON = "json"
	STRING = "string"
	
class StatusDevice(str, Enum):
	ONLINE = "online"
	OFFLINE = "offline"
	NOT_SUPPORTED = "not_supported"
	UNLINK = "unlink"
	UNKNOWN = "unknown"

class DeviceStatusField(str, Enum):
	UNLINK = "unlink"
	LINK = "link"

class TypeDeviceField(str, Enum):
	BINARY = "binary"
	NUMBER = "number"
	TEXT = "text"
	ENUM = "enum"
	BASE = "base"
	COUNTER = "counter"

class DeviceGetData(str, Enum):
	PULL = "pull"
	PUSH = 'push'

class FieldGetDataType(str, Enum):
	PUBLISH = "publish"
	READ = 'read'

class DeviceFieldCategory(str, Enum):
	CONFIG = 'config'
	DIAGNOSTIC = 'diagnostic'
