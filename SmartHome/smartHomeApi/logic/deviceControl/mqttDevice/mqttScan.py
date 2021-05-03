
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

def ClearTopicks():
    mqttTopics = []
