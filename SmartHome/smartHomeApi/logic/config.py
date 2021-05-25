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
    config.updateFrequency = data["updateFrequency"]
    config.mqttBroker = data["mqttBroker"]
    config.mqttBrokerPort = data["mqttBrokerPort"]
    config.loginMqttBroker = data["loginMqttBroker"]
    config.passwordMqttBroker = data["passwordMqttBroker"]
    config.save()
    return True

def GiveServerConfig():
    try:
        config = ServerConfig.objects.all()[0]
        server={"updateFrequency":config.updateFrequency,"mqttBroker":config.mqttBroker,"mqttBrokerPort":config.mqttBrokerPort,"loginMqttBroker":config.loginMqttBroker,"passwordMqttBroker":config.passwordMqttBroker}
        return server
    except Exception as e:
        return {"updateFrequency":6,"mqttBroker":"0.0.0.0","mqttBrokerPort":"2000","loginMqttBroker":"admin","passwordMqttBroker":"admin"}
