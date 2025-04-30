import logging
from app.ingternal.logs.logs import LogManager

# Настройка логирования
def getLogger(name):
    logger = logging.getLogger(name)
    logsHandler = LogManager("zigbeeServiceLogs", level=logging.DEBUG)
    logger.addHandler(logsHandler.get_file_handler())
    logger.setLevel(logging.DEBUG)
    return logger