from .weather import Weather
from datetime import datetime

def getServerData():
    now = datetime.now()
    return {
    "weather":Weather(),
    "date":"{}.{}.{}".format(now.day, now.month, now.year),
    "time":"{}:{}".format(now.hour, now.minute)
    }
