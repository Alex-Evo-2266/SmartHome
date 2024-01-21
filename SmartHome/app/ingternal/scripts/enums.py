
from enum import Enum

class TypeEntity(str, Enum):
	DEVICE = "device"
	TIME = "time"
	SERVICE = "service"

class TypeEntityAction(str, Enum):
	DEVICE = "device"
	SERVICE = "service"
	SCRIPT = "script"
	DELAY = "delay"

class TypeEntityCondition(str, Enum):
	DEVICE = "device"
	SERVICE = "service"
	TIME = "time"
	DATE = "date"
	
class Condition(str, Enum):
	AND = "and"
	OR = "or"
	
class Sign(str, Enum):
	EQUALLY = "equally"
	MORE = "more"
	LESS = "less"

class Periods(str, Enum):
	EVERY_HOUR = "every_hour"
	EVERY_DAY = "every_day"
	EVERY_MONTH = "every_month"
	EVERY_YEAR = "every_rear"


class TypeEntityInString(str, Enum):
	EVERY_HOUR = "every_hour"
	EVERY_DAY = "every_day"
	EVERY_MONTH = "every_month"
	EVERY_YEAR = "every_rear"
	DEVICE = "device"
	SERVICE = "service"

class TIME_DAYS(str, Enum):
	MON = "Mon"
	TUE = "Tue"
	WED = "Wed"
	THU = "Thu"
	FRI = "Fri"
	SAT = "Sat"
	SUN = "Sun"

class TIME_MONTH(str, Enum):
	January = "Jan"
	February = "Feb"
	March = "Mar"
	April = "Apr"
	May = "May"
	June = "Jun"
	July = "Jul"
	August = "Aug"
	September = "Sept"
	October = "Oct"
	November = "Nov"
	December = "Dec"