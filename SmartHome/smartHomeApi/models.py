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

class ServerConfig(models.Model):
    auteStyle = models.NullBooleanField("automatic style", default=True)
    staticBackground = models.NullBooleanField("static background", default=False)
    updateFrequency = models.IntegerField("time update", default=10)
    mqttBroker = models.CharField("mqttBroker address", max_length = 200, default="")
    loginMqttBroker = models.CharField("mqttBroker login", max_length = 200, default="")
    passwordMqttBroker = models.CharField("mqttBroker password", max_length = 200, default="")

    def __str__(self):
        return self.mqttBroker

class UsersConfig(models.Model):
    registerKey = models.SlugField("regKey", max_length = 200)

    def __str__(self):
        return self.registerKey
