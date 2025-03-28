from app.internal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler = LogManager("pagesLogs", level=LOGS_LEVEL)