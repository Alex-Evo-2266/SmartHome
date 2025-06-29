from app.internal.logs.handlers import handler_base, handler_listener
from app.internal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)
get_listener_logger = MyLogger(handler_listener)