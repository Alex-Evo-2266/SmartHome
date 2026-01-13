from app.internal.logs.get_logger import get_logger

class MyLogger:
    def __init__(self, file_name: str = None):
        self.file_name = file_name 

    def get_logger(self, name: str):
        return get_logger(name, self.file_name or name)

get_base_logger = MyLogger()
get_sender_logger = MyLogger()
get_router_logger = MyLogger()