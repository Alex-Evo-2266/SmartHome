from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .weather import WeatherSchema

class ServerConfigSchema(BaseModel):
    mqttBroker: str = "0.0.0.0"
    mqttBrokerPort: int = 1883
    loginMqttBroker: str = "admin"
    passwordMqttBroker: str = "admin"
    zigbee2mqttTopic: str = "zigbee2mqtt"
    emailLogin: str = ''
    emailPass: str = ''
    pages: List = []
    city: str = ''
    weatherKey:str = ''
    frequency: int = 6

class ServerDataSchema(BaseModel):
    weather: Optional[WeatherSchema]
    date: str = "{}.{}.{}".format(datetime.now().day, datetime.now().month, datetime.now().year)
    time: str = "{}:{}".format(datetime.now().hour, datetime.now().minute)
