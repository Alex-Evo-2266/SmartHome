from app.ingternal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler = LogManager("deviceLog")
handler_polling = LogManager("devicePollingLog")
handler_types = LogManager("deviceTypesLog")