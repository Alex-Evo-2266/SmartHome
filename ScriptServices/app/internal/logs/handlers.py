from app.internal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler_base = LogManager("deviceBaseLog", level=LOGS_LEVEL)
handler_sender = LogManager("deviceValueSendLog", level=LOGS_LEVEL)
