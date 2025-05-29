from app.ingternal.logs.logs import LogManager
from app.configuration.settings import LOGS_LEVEL

handler_base = LogManager("deviceBaseLog", level=LOGS_LEVEL)
handler_polling = LogManager("devicePollingLog", level=LOGS_LEVEL)
handler_automatization = LogManager("automatizationLog", level=LOGS_LEVEL)
handler_device_crud = LogManager("device_crud", level=LOGS_LEVEL)
handler_device_base_calss = LogManager("device_base_class", level=LOGS_LEVEL)
handler_device_save = LogManager("device_save", level=LOGS_LEVEL)