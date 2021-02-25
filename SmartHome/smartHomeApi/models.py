from django.db import models


def genId(El)->int:
    i = 1
    j = 0
    b = False
    while i<=len(El)+1:
        b = False
        while j<len(El):
            if El[j].id==i:
                b = True
                break
            j +=1
        if(not b):
            return i
        i+=1
    return 1
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
    mqttBroker = models.CharField("mqttBroker ip", max_length = 200, default="")
    loginMqttBroker = models.CharField("mqttBroker login", max_length = 200, default="")
    passwordMqttBroker = models.CharField("mqttBroker password", max_length = 200, default="")
    mqttBrokerPort = models.CharField("mqttBroker port", max_length = 200, default="")

    def __str__(self):
        return self.mqttBrokerPort

class UsersConfig(models.Model):
    registerKey = models.SlugField("regKey", max_length = 200)

    def __str__(self):
        return self.registerKey

class Room(models.Model):
    RoomName = models.CharField("root name", max_length = 200)

    def __str__(self):
        return self.RoomName

class Device(models.Model):
    id = models.IntegerField("id", primary_key=True)
    DeviceName = models.CharField("device name", max_length = 200)
    DeviceSystemName = models.SlugField("device system name", max_length = 200)
    DeviceInformation = models.TextField("device info", default="")
    DeviceType = models.SlugField("device type", max_length = 200, default="")
    DeviceTypeConnect = models.SlugField("device connect type", max_length = 200, default="")
    DeviceControl= models.TextField("device control", max_length = 200, default="")
    room = models.ForeignKey(Room, on_delete = models.SET_NULL, null=True)

    def __str__(self):
        return self.DeviceName + " " + self.DeviceControl

    def receiveDict(self):
        return {
            "DeviceId":self.id,
            "DeviceName":self.DeviceName,
            "DeviceSystemName":self.DeviceSystemName,
            "DeviceInformation":self.DeviceInformation,
            "DeviceType":self.DeviceType,
            "DeviceTypeConnect":self.DeviceTypeConnect,
            "RoomId":self.room_id
        }

class ConfigDevice(models.Model):
    id = models.IntegerField("id", primary_key=True)
    type = models.SlugField("device config type", max_length = 200)
    address = models.SlugField("device config address", max_length = 200)
    token = models.SlugField("device token", max_length = 200, default="")
    low = models.SlugField("device config low", max_length = 200, default="0")
    high = models.SlugField("device config high", max_length = 200, default="255")
    icon = models.SlugField("device icon", max_length = 200, default="")
    device = models.ForeignKey(Device, on_delete = models.CASCADE)

    def __str__(self):
        return self.address +" "+ self.type

    def receiveDict(self):
        return {
            "type":self.type,
            "address":self.address,
            "low":self.low,
            "high":self.high,
            "icon":self.icon,
            "token":self.token
        }

class ValueDevice(models.Model):
    id = models.IntegerField("id", primary_key=True)
    type = models.SlugField("device value type", max_length = 200)
    value = models.SlugField("device value value", max_length = 200)
    device = models.ForeignKey(Device, on_delete = models.CASCADE)

    def __str__(self):
        return self.type +" "+ self.value

    def receiveDict(self):
        return {
            "type":self.type,
            "value":self.value,
        }

class ValueListDevice(models.Model):
    id = models.IntegerField("id", primary_key=True, max_length = 255)
    type = models.SlugField("device value list type", max_length = 200)
    value = models.SlugField("device value list value", max_length = 200)
    date = models.DateTimeField("device value element date")
    device = models.ForeignKey(Device, on_delete = models.CASCADE)

    def __str__(self):
        return self.type +" "+ self.value

    def receiveDict(self):
        return {
            "type":self.type,
            "value":self.value,
            "date":self.date
        }
class HomePage(models.Model):
    id = models.IntegerField("id", primary_key=True, max_length = 255)
    name = models.CharField("page name", max_length = 50)
    information = models.TextField("page info", default="")
    def __str__(self):
        return self.name

    def receiveDict(self):
        return {
            "id":self.id,
            "name":self.name,
            "information":self.information
        }

class HomeCart(models.Model):
    id = models.IntegerField("id", primary_key=True, max_length = 255)
    idInPage = models.IntegerField("id in page", max_length = 255)
    name = models.CharField("cart name", max_length = 50)
    type = models.CharField("cart type", max_length = 20)
    order = models.IntegerField("cart order", default=10)
    homePage = models.ForeignKey(HomePage, on_delete = models.CASCADE)

    def __str__(self):
        return self.name

    def receiveDict(self):
        return {
            "mainId":self.id,
            "id":self.idInPage,
            "name":self.name,
            "type":self.type,
            "order":self.order,
        }

class CartChildren(models.Model):
    id = models.IntegerField("id", primary_key=True, max_length = 255)
    name = models.CharField("element name", max_length = 50)
    type = models.CharField("element type", max_length = 20)
    typeAction = models.CharField("element typeAction", max_length = 20)
    order = models.IntegerField("element order", default=0)
    device = models.OneToOneField(Device, on_delete = models.SET_NULL, null=True)
    action = models.CharField("element action", max_length = 20, default = "get")
    homeCart = models.ForeignKey(HomeCart, on_delete = models.CASCADE)

    def __str__(self):
        return self.name

    def receiveDict(self):
        return {
            "id":self.id,
            "name":self.name,
            "type":self.type,
            "action":self.action,
            "typeAction":self.typeAction,
            "deviceId":self.device.id,
            "order":self.order,
        }
