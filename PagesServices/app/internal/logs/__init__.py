from app.internal.logs.handlers import handler_base
from app.internal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)

