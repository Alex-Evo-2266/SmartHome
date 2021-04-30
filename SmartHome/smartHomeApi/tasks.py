from SmartHome.celery import app
from websocket import create_connection


@app.task
def updataDataDevice():
    try:
        ws = create_connection('ws://127.0.0.1:5000/ws/smartHome/devices/')
        ws.send('{"message":"all"}')
        ws.close()
    except Exception as e:
        print("error",e) 
