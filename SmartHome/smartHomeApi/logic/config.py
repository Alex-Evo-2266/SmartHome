from django.conf import settings
from ..models import UsersConfig,ServerConfig

def editUsersConf(data):
    try:
        config = UsersConfig.objects.all()
        if(len(config)==0):
            conf = UsersConfig.objects.create(registerKey=data.get("registerKey"))
            conf.save()
        else:
            conf = config[0]
            conf.registerKey = data.get("registerKey")
            conf.save()
        return True
    except:
        return False

def giveuserconf():
    config = UsersConfig.objects.get(id=1)
    ret = {"registerKey":config.registerKey}
    return ret

def ServerConfigEdit(data):
    config = ServerConfig.objects.get(id=1)
    if not config:
        config = ServerConfig.objects.create(id=1)
    config.auteStyle = data["auteStyle"]
    config.staticBackground = data["staticBackground"]
    config.updateFrequency = data["updateFrequency"]
    config.mqttBroker = data["mqttBroker"]
    config.mqttBrokerPort = data["mqttBrokerPort"]
    config.loginMqttBroker = data["loginMqttBroker"]
    config.passwordMqttBroker = data["passwordMqttBroker"]
    config.save()
    return True

def GiveServerConfig():
    config = ServerConfig.objects.all()[0]
    server={"auteStyle":config.auteStyle,"staticBackground":config.staticBackground,"updateFrequency":config.updateFrequency,"mqttBroker":config.mqttBroker,"mqttBrokerPort":config.mqttBrokerPort,"loginMqttBroker":config.loginMqttBroker,"passwordMqttBroker":config.passwordMqttBroker}
    return server
