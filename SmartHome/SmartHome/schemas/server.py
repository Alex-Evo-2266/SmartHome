from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .weather import WeatherSchema

class ServerModuleConfigFieldSchema(BaseModel):
    name:str
    value: str

class ServerModuleConfigSchema(BaseModel):
    name: str
    fields: List[ServerModuleConfigFieldSchema]

class ServerConfigSchema(BaseModel):
    pages: List = []
    moduleConfig: Optional[List[ServerModuleConfigSchema]] = []

class ServerDataSchema(BaseModel):
    weather: Optional[WeatherSchema]
    date: str = "{}.{}.{}".format(datetime.now().day, datetime.now().month, datetime.now().year)
    time: str = "{}:{}".format(datetime.now().hour, datetime.now().minute)
