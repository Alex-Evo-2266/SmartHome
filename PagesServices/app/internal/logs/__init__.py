from app.internal.logs.handlers import handler_base, handler_polling
from app.internal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)
get_polling_logger = MyLogger(handler_polling)

