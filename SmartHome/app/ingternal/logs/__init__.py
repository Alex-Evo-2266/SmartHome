from app.ingternal.logs.handlers import handler, handler_polling, handler_types
from app.ingternal.logs.logs import MyLogger

get_base_logger = MyLogger(handler)
get_polling_logger = MyLogger(handler_polling)