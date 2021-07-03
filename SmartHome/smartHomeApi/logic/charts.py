from ..models import ValueListDevice,Device
from datetime import datetime,timedelta

def blankSheet(values):
    newVal = dict()
    for item in values:
        if(not(item.device.DeviceSystemName in newVal)):
            newVal[item.device.DeviceSystemName] = dict()
        if(not(item.name in newVal[item.device.DeviceSystemName])):
            dev = newVal[item.device.DeviceSystemName]
            dev[item.name] = list()
    return newVal

def editMicrosec(date, newMicros):
    return datetime(date.year,date.month,date.day,date.hour,date.minute,date.second,newMicros)

def valNoRepetitions(date):
    newsortVal = list()
    for item in date:
        flag = True
        for item2 in newsortVal:
            if(item["date"]==item2["date"] and item["device"]==item2["device"] and item["name"]==item2["name"]):
                flag=False
        if(flag):
            newsortVal.append(item)
    return newsortVal

def roundToHalfASecond(data):
    sortVal = list()
    for item in data:
        element = item.receiveDict()
        if(element["date"].microsecond > 500000):
            element["date"] = editMicrosec(element["date"],500000)
        else:
            element["date"] = editMicrosec(element["date"],000000)
        sortVal.append(element)
    return sortVal

def timesort(data):
    time = list()
    for item in data:
        flag = True
        for item2 in time:
            if(item["date"]==item2):
                flag=False
        if(flag):
            time.append(item["date"])
    return time

def formData(data,time,data2):
    newVal = data
    timeStamp = list()
    for item in time:
        index = time.index(item)
        for item2 in data2:
            if(item==item2["date"]):
                newVal[item2["device"]][item2["name"]].append(item2["value"])
        for key in newVal:
            for key2 in newVal[key]:
                if(len(newVal[key][key2])-1 < index):
                    if(index==0):
                        newVal[key][key2].append(None)
                    else:
                        newVal[key][key2].append(newVal[key][key2][len(newVal[key][key2])-1])
    for item in time:
        timeStamp.append(item.timestamp() * 1000)
    return {"time_line":timeStamp,"lines":newVal}

def getCharts():
    values = ValueListDevice.objects.all()
    newsortVal = valNoRepetitions(roundToHalfASecond(values))
    return {"charts":formData(blankSheet(values),timesort(newsortVal),newsortVal)}
