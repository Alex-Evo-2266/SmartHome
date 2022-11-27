from weather.weather import Weather
from datetime import datetime
from SmartHome.websocket import WebSocketMenager

from SmartHome.schemas.server import ServerDataSchema

async def getServerData():
    now = datetime.now()
    return ServerDataSchema(
        weather=Weather(),
        date="{}.{}.{}".format(datetime.now().day, datetime.now().month, datetime.now().year),
        time="{}:{}".format(datetime.now().hour, datetime.now().minute)
    )

async def sendServerData():
    data = await getServerData()
    await WebSocketMenager.send_information("server", data.dict())
