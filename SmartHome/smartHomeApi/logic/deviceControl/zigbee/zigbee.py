from ..mqttDevice.connect import publish

def reboot(zigbeetopik):
    topic = zigbeetopik + "/bridge/request/restart"
    publish(topic,"")
