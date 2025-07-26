from app.ingternal.logs.handlers import handler_base, handler_test, handler_listener, handler_sender, handler_polling,handler_room, handler_automatization, handler_device_crud, handler_device_base_calss, handler_device_save
from app.ingternal.logs.logs import MyLogger

get_base_logger = MyLogger(handler_base)
get_polling_logger = MyLogger(handler_polling)
get_automatization = MyLogger(handler_automatization)
get_device_crud = MyLogger(handler_device_crud)
get_device_base_class = MyLogger(handler_device_base_calss)
get_device_save = MyLogger(handler_device_save)
get_room_logger = MyLogger(handler_room)
get_sender_logger = MyLogger(handler_sender)
get_listener_logger = MyLogger(handler_listener)
get_test_logger = MyLogger(handler_test)