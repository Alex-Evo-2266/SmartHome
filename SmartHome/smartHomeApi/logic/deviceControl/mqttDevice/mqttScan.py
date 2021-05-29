from smartHomeApi.models import Device,ValueDevice
mqttTopics = []

def getIdTopic(topic):
    for item in mqttTopics:
        if(item["topic"]==topic):
            return mqttTopics.index(item)

def addTopic(topic,message):
    t = {
        "topic":topic,
        "message":message
    }
    id = getIdTopic(topic)
    if(id != None):
        mqttTopics[id] = t
        return t
    mqttTopics.append(t)
    return t

def getTopicksAll():
    return mqttTopics

def getTopicksAndLinc():
    topics = getTopicksAll()
    for item in topics:
        topic = item["topic"]
        last = topic.split('/')[-1]
        first = topic.split('/')[0:-1]
        first = "/".join(first)
        lincs = list()
        for device in Device.objects.all():
            if device.DeviceValueType=="json":
                if(device.DeviceAddress==topic or (device.DeviceAddress==first and last == "set")):
                    lincs.append({
                    "device": device.receiveDict()
                    })
            else:
                for devValue in device.valuedevice_set.all():
                    if ((device.DeviceAddress + "/" + devValue.address ==topic) and last != "set"):
                        lincs.append({
                        "device": device.receiveDict(),
                        "field": devValue.receiveDictConf()
                        })
        item["lincs"] = lincs
        if(last == "set"):
            item["set"] = True
    return topics

def ClearTopicks():
    mqttTopics = []
