from app.internal.logs.logs import MyLogger
from app.internal.logs.handlers import handler_base, handler_listener

get_base_logger = MyLogger(handler_base)
get_listener_logger = MyLogger(handler_listener)

# get_base_logger = MyLogger()
# get_listener_logger = MyLogger()