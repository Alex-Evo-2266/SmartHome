from app.ingternal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler_base = LogManager("deviceBaseLog", level=LOGS_LEVEL)
handler_polling = LogManager("devicePollingLog", level=LOGS_LEVEL)