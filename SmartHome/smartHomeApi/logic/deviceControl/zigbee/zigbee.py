from ..mqttDevice.connect import publish

def reboot(zigbeetopik):
    topic = zigbeetopik + "/bridge/request/restart"
    publish(topic,"")

def permission_join(zigbeetopik,state:bool):
    topic = zigbeetopik + "/bridge/request/permit_join"
    publish(topic,state)

def zigbeeDeviceRename(zigbeetopik, name, newName):
    topic = zigbeetopik + "/bridge/request/device/rename"
    message = '{"from": "' + name + '", "to": "' + newName + '"}'
    publish(topic,message)
