from django.db import models

# Create your models here.
class User(models.Model):
    UserName = models.CharField("user name", max_length = 200)
    UserSurname = models.CharField("user surname", max_length = 200, default="")
    UserPassword = models.CharField("user password", max_length = 200)
    UserEmail = models.EmailField("user email")
    UserMobile = models.CharField("user mobile", max_length = 200)
    UserLevel = models.IntegerField("user level", default=1)

    def __str__(self):
        return self.UserName

class UserConfig(models.Model):
    Style = models.CharField("user name", max_length = 200, default="light")
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True)

    def __str__(self):
        return self.Style

    def give(self):
        return {"Style":self.Style}


class Device(models.Model):
    DeviceName = models.CharField("device name", max_length = 200)
    DeviceSystemName = models.CharField("device system name", max_length = 200)
    DeviceInformation = models.TextField("user config")
    DeviceTypeConnect = models.CharField("device type connect", max_length = 200)
    DeviceType = models.CharField("device type", max_length = 200)

    def __str__(self):
        return self.DeviceSystemName

class DeviceValue(models.Model):
    power = models.NullBooleanField("power", default=False)
    dimmer = models.CharField("dimmer", max_length = 200, default="")
    color = models.CharField("color", max_length = 200, default="")
    mode = models.CharField("mode", max_length = 200, default="")
    temp = models.CharField("temp", max_length = 200, default="")
    value = models.CharField("value", max_length = 200, default="")
    battery = models.CharField("battery", max_length = 200, default="")
    device = models.OneToOneField(Device, on_delete = models.CASCADE, primary_key = True)

    def give(self):
        return {
            "power":self.power,
            "dimmer":self.dimmer,
            "color":self.color,
            "mode":self.mode,
            "temp":self.temp,
            "value":self.value,
            "battery":self.battery,
        }

class DeviceConfig(models.Model):
    power = models.CharField("power topic", max_length = 200, default="")
    dimmer = models.CharField("dimmer topic", max_length = 200, default="")
    color = models.CharField("color topic", max_length = 200, default="")
    mode = models.CharField("mode topic", max_length = 200, default="")
    temp = models.CharField("temp topic", max_length = 200, default="")
    turnOnSignal = models.CharField("On signal", max_length = 200, default="")
    turnOffSignal = models.CharField("Off signal", max_length = 200, default="")
    maxDimmer = models.IntegerField("maxDimmerl", default=255)
    minDimmer = models.IntegerField("minDimmer", default=0)
    maxColor = models.IntegerField("maxColor", default=255)
    minColor = models.IntegerField("minColor", default=0)
    maxTemp = models.IntegerField("maxTemp", default=255)
    minTemp = models.IntegerField("minTemp", default=0)
    countMode = models.IntegerField("countMode", default=2)
    device = models.OneToOneField(Device, on_delete = models.CASCADE, primary_key = True)

    def give(self):
        return {
            "power":self.power,
            "dimmer":self.dimmer,
            "color":self.color,
            "mode":self.mode,
            "temp":self.temp,
            "turnOnSignal":self.turnOnSignal,
            "turnOffSignal":self.turnOffSignal,
            "maxDimmer":self.maxDimmer,
            "minDimmer":self.minDimmer,
            "maxColor":self.maxColor,
            "minColor":self.minColor,
            "maxTemp":self.maxTemp,
            "minTemp":self.minTemp,
            "countMode":self.countMode
        }


class ServerConfig(models.Model):
    auteStyle = models.NullBooleanField("automatic style", default=True)
    staticBackground = models.NullBooleanField("static background", default=False)
    updateFrequency = models.IntegerField("time update", default=10)
    mqttBroker = models.CharField("mqttBroker address", max_length = 200, default="")
    loginMqttBroker = models.CharField("mqttBroker login", max_length = 200, default="")
    passwordMqttBroker = models.CharField("mqttBroker password", max_length = 200, default="")

    def __str__(self):
        return self.mqttBroker
