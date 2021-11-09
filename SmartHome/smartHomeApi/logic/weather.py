from smartHomeApi.logic.config.configget import getConfig
import requests,bs4,json
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
        # city = "kazan"
        # res = requests.get('https://yandex.ru/pogoda/' + city)
        # # print(res.text)
        # HTML=bs4.BeautifulSoup(res.text, "html.parser")
        # # print(HTML)
        # card = HTML.find('div', class_= 'fact__temp-wrap')
        # # print("1",card)
        # fact_temp = None
        # anchor = None
        # if(card):
        #     fact_temp = card.find('div', class_='fact__temp')
        #     # print("2")
        #     anchor = card.find('div',class_='link__condition')
        # # print("r")
        # Days = HTML.find('div',class_='forecast-briefly__days').find('ul',class_="swiper-wrapper").find_all('div',class_="forecast-briefly__day")
        # # print("3")
        # tenDays = Days[0:5]
        daysWeather = list()
        weatherNow = current_weather(weatherConf["city"],weatherConf["APPID"])
        # for day in weatherNow["list"]:
        #     data = {
        #     "name":day.find('div', class_="forecast-briefly__name").text,
        #     "date":day.get("dt_txt"),
        #     "day":day.find('div', class_="forecast-briefly__temp_day").find('span',class_="temp__value").text,
        #     "night":day.find('div', class_="forecast-briefly__temp_night").find('span',class_="temp__value").text,
        #     "weather":day.find('div', class_="forecast-briefly__condition").text,
        #     }
        #     daysWeather.append(data)
        # print("weatherConf",weatherNow)
        print(weatherNow)
        dataWeather = {
            "city":weatherConf["city"],
            "now":{
                "temp":weatherNow.get("list")[0].get("main").get("temp"),
                "weather":weatherNow.get("list")[0].get("weather")[0].get("main")
            },
            "forecast":None
        }
        print(dataWeather)
    except Exception as e:
        print("er Wether",e)
        return None
