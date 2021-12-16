from smartHomeApi.logic.config.configget import getConfig
import requests,bs4,json
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

URL_BASE = "http://api.openweathermap.org/data/2.5/"

dataWeather = dict()

def current_weather(q: str, appid: str) -> dict:
    """https://openweathermap.org/api"""
    return requests.get(URL_BASE + "forecast", params=locals()).json()

def Weather():
    global dataWeather
    return dataWeather

def updateWeather():

    try:
        weatherConf = getConfig("weather")
        global dataWeather
        timeWeather = list()
        dateWeather = list()
        weatherNow = current_weather(weatherConf["city"],weatherConf["APPID"])
        for item in weatherNow["list"]:
            time = datetime.utcfromtimestamp(item["dt"])
            if(time.strftime('%H:%M:%S')=="12:00:00"):
                dateWeather.append({
                    "day":{
                        "date": time.strftime('%Y-%m-%d'),
                        "time": time.strftime('%H:%M:%S'),
                        "temp": item.get("main").get("temp"),
                        "temp_max": item.get("main").get("temp_max"),
                        "temp_min": item.get("main").get("temp_min"),
                        "weather": item.get("weather")[0].get("main"),
                        "wind": item.get("wind")
                    },
                    "night":{}
                })
            if(time.strftime('%H:%M:%S')=="21:00:00" and len(dateWeather) > 0):
                dateWeather[len(dateWeather) - 1]["night"] = {
                    "date": time.strftime('%Y-%m-%d'),
                    "time": time.strftime('%H:%M:%S'),
                    "temp": item.get("main").get("temp"),
                    "temp_max": item.get("main").get("temp_max"),
                    "temp_min": item.get("main").get("temp_min"),
                    "weather": item.get("weather")[0].get("main"),
                    "wind": item.get("wind")
                }
        for item in weatherNow["list"]:
            time = datetime.utcfromtimestamp(item["dt"])
            timeWeather.append({
                "date": time.strftime('%Y-%m-%d'),
                "time": time.strftime('%H:%M:%S'),
                "temp": item.get("main").get("temp"),
                "temp_max": item.get("main").get("temp_max"),
                "temp_min": item.get("main").get("temp_min"),
                "weather": item.get("weather")[0].get("main"),
                "wind": item.get("wind")
            })
        dataWeather = {
            "city":weatherConf["city"],
            "now":{
                "temp":weatherNow.get("list")[0].get("main").get("temp"),
                "weather":weatherNow.get("list")[0].get("weather")[0].get("main")
            },
            "forecastTime":timeWeather,
            "forecastDate":dateWeather
        }
    except Exception as e:
        logger.warning(f'get weather forecast')
        return None
