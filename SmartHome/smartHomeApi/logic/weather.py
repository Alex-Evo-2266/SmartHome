import requests,bs4,json

def Weather():
    try:
        city = "kazan"
        res = requests.get('https://yandex.ru/pogoda/' + city)
        # print(res.text)
        HTML=bs4.BeautifulSoup(res.text, "html.parser")
        # print(HTML)
        card = HTML.find('div', class_= 'fact__temp-wrap')
        # print("1",card)
        fact_temp = None
        anchor = None
        if(card):
            fact_temp = card.find('div', class_='fact__temp')
            # print("2")
            anchor = card.find('div',class_='link__condition')
        # print("r")
        Days = HTML.find('div',class_='forecast-briefly__days').find('ul',class_="swiper-wrapper").find_all('div',class_="forecast-briefly__day")
        # print("3")
        tenDays = Days[0:5]
        daysWeather = list()
        for day in tenDays:
            data = {
            "name":day.find('div', class_="forecast-briefly__name").text,
            "date":day.find('time', class_="forecast-briefly__date").text,
            "day":day.find('div', class_="forecast-briefly__temp_day").find('span',class_="temp__value").text,
            "night":day.find('div', class_="forecast-briefly__temp_night").find('span',class_="temp__value").text,
            "weather":day.find('div', class_="forecast-briefly__condition").text,
            }
            daysWeather.append(data)

        return {
            "city":city,
            "now":{
                "temp":fact_temp.find('span',class_='temp__value').text,
                "weather":str(anchor.text)
            },
            "tenDays":daysWeather
        }
    except Exception as e:
        print("er Wether",e)
        return None
