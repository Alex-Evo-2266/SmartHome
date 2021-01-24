from django.db import models

# Create your models here.
class User(models.Model):
    UserName = models.CharField("user name", max_length = 200)
    UserPassword = models.CharField("user password", max_length = 200)
    UserEmail = models.EmailField("user email")
    UserMobile = models.CharField("user mobile", max_length = 200)
    UserLevel = models.IntegerField("user level")

    def __str__(self):
        return self.UserName

class Device(models.Model):
    DeviceName = models.CharField("device name", max_length = 200)
    DeviceSystemName = models.CharField("device system name", max_length = 200)
    DeviceInformation = models.TextField("user config")
    DeviceTypeConnect = models.CharField("device type connect", max_length = 200)
    DeviceType = models.CharField("device type", max_length = 200)

    def __str__(self):
        return self.DeviceSystemName
