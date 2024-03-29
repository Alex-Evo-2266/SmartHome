import requests,json
import logging

from datetime import datetime

from SmartHome.schemas.weather import WeatherSchema, NowWeatherSchema, WeatherTimeSchema, WeatherDateSchema
from SmartHome.logic.server.modulesconfig import configManager

logger = logging.getLogger(__name__)

URL_BASE = "http://api.openweathermap.org/data/2.5/"

dataWeather: WeatherSchema = WeatherSchema(
    city='',
    now=NowWeatherSchema(
        temp='',
        weather=''
    ),
    forecastTime=[],
    forecastDate=[]
    )

def current_weather(q: str, appid: str) -> dict:
    """https://openweathermap.org/api"""
    return requests.get(URL_BASE + "forecast", params=locals()).json()

def Weather():
    global dataWeather
    return dataWeather

async def updateWeather():

    try:
        weatherConf = configManager.getConfig("weather")
        global dataWeather
        timeWeather = list()
        dateWeather = list()
        weatherNow = current_weather(weatherConf["city"],weatherConf["APPID"])
        for item in weatherNow["list"]:
            time = datetime.utcfromtimestamp(item["dt"])
            if(time.strftime('%H:%M:%S')=="12:00:00"):
                dateWeather.append(
                    WeatherDateSchema(
                        day=WeatherTimeSchema(
                            date=time.strftime('%Y-%m-%d'),
                            time=time.strftime('%H:%M:%S'),
                            temp=item.get("main").get("temp"),
                            temp_max=item.get("main").get("temp_max"),
                            temp_min=item.get("main").get("temp_min"),
                            weather=item.get("weather")[0].get("main"),
                            wind=item.get("wind")
                        )
                    )
                )
            if(time.strftime('%H:%M:%S')=="21:00:00" and len(dateWeather) > 0):
                dateWeather[len(dateWeather) - 1].night=WeatherTimeSchema(
                    date=time.strftime('%Y-%m-%d'),
                    time=time.strftime('%H:%M:%S'),
                    temp=item.get("main").get("temp"),
                    temp_max=item.get("main").get("temp_max"),
                    temp_min=item.get("main").get("temp_min"),
                    weather=item.get("weather")[0].get("main"),
                    wind=item.get("wind")
                )
        for item in weatherNow["list"]:
            time = datetime.utcfromtimestamp(item["dt"])
            timeWeather.append(WeatherTimeSchema(
                date=time.strftime('%Y-%m-%d'),
                time=time.strftime('%H:%M:%S'),
                temp=item.get("main").get("temp"),
                temp_max=item.get("main").get("temp_max"),
                temp_min=item.get("main").get("temp_min"),
                weather=item.get("weather")[0].get("main"),
                wind=item.get("wind")
            ))
        dataWeather = WeatherSchema(
            city=weatherConf["city"],
            now=NowWeatherSchema(
                temp=weatherNow.get("list")[0].get("main").get("temp"),
                weather=weatherNow.get("list")[0].get("weather")[0].get("main")
            ),
            forecastTime=timeWeather,
            forecastDate=dateWeather
        )
    except Exception as e:
        logger.warning(f'error get weather forecast. detail {e}')
        return None
