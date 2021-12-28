from pydantic import BaseModel
from typing import Optional, List, Dict
from datetime import date, time

class NowWeatherSchema(BaseModel):
    temp: str
    weather: str

class WeatherTimeSchema(BaseModel):
    date: str
    time: str
    temp: str
    temp_max: str
    temp_min: str
    weather: str
    wind: Dict

class WeatherDateSchema(BaseModel):
    day: Optional[WeatherTimeSchema]
    night: Optional[WeatherTimeSchema]

class WeatherSchema(BaseModel):
    city: str
    now: NowWeatherSchema
    forecastTime: Optional[List[WeatherTimeSchema]]
    forecastDate: Optional[List[WeatherDateSchema]]
