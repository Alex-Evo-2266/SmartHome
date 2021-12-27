from .Yeelight import Yeelight

def getInfo():
    return {
        "type":"device",
        "name":"yeelight",
        "devices":[{
            "class":Yeelight,
            "name":"yeelight",
            "typeDevices":["light"]
        }]
    }
