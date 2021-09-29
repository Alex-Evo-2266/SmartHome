from ..mqttDevice.connect import publish

def reboot(zigbeetopik):
    topic = zigbeetopik + "/bridge/request/restart"
    publish(topic,"")

def permission_join(zigbeetopik,state:bool):
    topic = zigbeetopik + "/bridge/request/permit_join"
    publish(topic,state)
