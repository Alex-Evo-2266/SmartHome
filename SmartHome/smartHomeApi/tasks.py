from SmartHome.celery import app
from websocket import create_connection
from SmartHome.settings import SMART_HOME_HOST, SMART_HOME_PORT


@app.task
def updataDataDevice():
    host = SMART_HOME_HOST
    port = SMART_HOME_PORT
    try:
        ws = create_connection('ws://'+host+':'+port+'/ws/smartHome/devices/')
        ws.send('{"message":"all"}')
        ws.close()
    except Exception as e:
        print("error",e)
