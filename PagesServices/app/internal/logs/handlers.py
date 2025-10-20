from app.internal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler_base = LogManager("pagesLogs", level=LOGS_LEVEL)
handler_listener = LogManager("listenerLogs", level=LOGS_LEVEL)