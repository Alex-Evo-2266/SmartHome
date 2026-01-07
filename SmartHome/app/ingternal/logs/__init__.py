from app.ingternal.logs.get_logger import get_logger

class MyLogger:
    def __init__(self, file_name: str = None):
        self.file_name = file_name 

    def get_logger(self, name: str):
        return get_logger(name, self.file_name or name)

get_base_logger = MyLogger()
get_polling_logger = MyLogger()
get_automatization = MyLogger()
get_device_crud = MyLogger()
get_device_base_class = MyLogger()
get_device_save = MyLogger()
get_room_logger = MyLogger()
get_sender_logger = MyLogger()
get_listener_logger = MyLogger()
get_test_logger = MyLogger()
get_loop_logger = MyLogger()
get_queue = MyLogger()