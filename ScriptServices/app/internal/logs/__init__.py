from app.internal.logs.handlers import handler_base, handler_sender
from app.internal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)
get_sender_logger = MyLogger(handler_sender)
