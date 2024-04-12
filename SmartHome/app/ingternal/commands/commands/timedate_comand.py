from datetime import datetime

def get_now_time():
    time = datetime.now()
    return f"{time.hour}:{time.minute}"
