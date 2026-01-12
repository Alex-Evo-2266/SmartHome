import logging
from app.bootstrap.const import BASE_DIR

try:
    # from app.bootstrap.settings_local import *
    raise Exception()
except Exception as e:
    from app.bootstrap.settings_prod import *

ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

DB_URL = "".join(["mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE])
print("bd: ",DB_URL)

LOGS_DIR = os.path.join(BASE_DIR, 'logs')
LOGS_LEVEL = logging.DEBUG if DEBUG else logging.INFO