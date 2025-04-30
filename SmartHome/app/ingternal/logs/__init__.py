from app.ingternal.logs.handlers import handler_base, handler_polling, handler_automatization
from app.ingternal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)
get_polling_logger = MyLogger(handler_polling)
get_automatization = MyLogger(handler_automatization)