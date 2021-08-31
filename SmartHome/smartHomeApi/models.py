from django.db import models
from datetime import datetime

def set_to_list_dict(items):
    item_list = list()
    for item in items:
        item_list.append(item.model_to_dict())
    return item_list

def set_dict_ro_null(item):
    print(item)
    if(item):
        return item.model_to_dict()
    return None

def getIdDevices(El):
    l = list()
    for item in El:
        l.append(item.id)
    return l

def largestId(El):
    l = getIdDevices(El)
    id = 1
    for item in l:
        if item>id:
            id=item
    return id

def getEmptyId(El):
    l = list()
    full = getIdDevices(El)
    i = 1
    while i<=largestId(El)+1:
        b = True
        for item in full:
            if item==i:
                b=False
        if b:
            l.append(i)
        i+=1
    return l

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
    id = models.AutoField("id", primary_key=True)
    UserName = models.CharField("user name", max_length = 200)
    UserSurname = models.CharField("user surname", max_length = 200, default="")
    UserPassword = models.CharField("user password", max_length = 200)
    UserEmail = models.EmailField("user email")
    UserMobile = models.CharField("user mobile", max_length = 200)
    UserLevel = models.IntegerField("user level", default=1)

    def __str__(self):
        return self.UserName

    def model_to_dict(self):
        return{
            "UserId":self.id,
            "UserName":self.UserName,
            "UserSurname":self.UserSurname,
            "Mobile":self.UserMobile,
            "Email":self.UserEmail,
            "Level":self.UserLevel,
            "ImageId":None
        }

    def getConfig(self):
        return set_to_list_dict(self.menuelement_set.all())

class LocalImage(models.Model):
    id = models.IntegerField("id", primary_key=True)
    title = models.CharField("название", max_length = 200, default="")
    image = models.ImageField("Изображение",upload_to="public")

    def model_to_dict(self):
        return {
        "id":self.id,
        "title":self.title,
        "image":self.image.url,
        }

    def __str__(self):
        return self.title

class ImageBackground(models.Model):
    id = models.IntegerField("id", primary_key=True)
    type = models.CharField("название", max_length = 200, default="base")
    image = models.ForeignKey(LocalImage, on_delete = models.SET_NULL, null=True)

    def model_to_dict(self):
        return {**self.image.model_to_dict(),"type":self.type}

class UserConfig(models.Model):
    Style = models.CharField("style", max_length = 200, default="light")
    auteStyle = models.BooleanField("automatic style", default=True)
    staticBackground = models.BooleanField("static background", default=False)
    background = models.ManyToManyField(ImageBackground,verbose_name="фон", related_name="background")
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True)

    def __str__(self):
        return self.Style

    def get(self):
        return {
        "Style":self.Style,
        "autoStyle":self.auteStyle,
        "staticBackground":self.staticBackground,
        "images":set_to_list_dict(self.background.all())
        }

class MenuElement(models.Model):
    """docstring for MenuElement."""
    id = models.IntegerField("id", primary_key=True)
    title = models.CharField("user name", max_length = 200)
    iconClass = models.CharField("user name", max_length = 200, default="fab fa-chrome")
    url = models.SlugField(max_length=160, default="#")
    user = models.ForeignKey(User, on_delete = models.CASCADE)

    def model_to_dict(self):
        return{
        "title":self.title,
        "iconClass":self.iconClass,
        "url":self.url
        }

class Room(models.Model):
    id = models.AutoField("id", primary_key=True)
    RoomName = models.CharField("root name", max_length = 200)

    def __str__(self):
        return self.RoomName

class Device(models.Model):
    id = models.IntegerField("id", primary_key=True)
    DeviceStatus = models.BooleanField("статус",default=True)
    DeviceName = models.CharField("device name", max_length = 200)
    DeviceSystemName = models.SlugField("device system name", max_length = 200)
    DeviceAddress = models.SlugField("device address", max_length = 200, default="")
    DeviceToken = models.SlugField("device token", max_length = 200, default="")
    DeviceInformation = models.TextField("device info", default="")
    DeviceType = models.SlugField("device type", max_length = 200, default="")
    DeviceTypeConnect = models.SlugField("device connect type", max_length = 200, default="")
    DeviceValueType = models.SlugField("device value type", max_length = 200, default="json")
    DeviceControl= models.TextField("device control", max_length = 200, default="")
    room = models.ForeignKey(Room, on_delete = models.SET_NULL, null=True)

    def __str__(self):
        return self.DeviceName + ", " + self.DeviceControl

    def receiveDict(self):
        return {
            "DeviceId":self.id,
            "DeviceStatus":self.DeviceStatus,
            "DeviceName":self.DeviceName,
            "DeviceSystemName":self.DeviceSystemName,
            "DeviceInformation":self.DeviceInformation,
            "DeviceType":self.DeviceType,
            "DeviceTypeConnect":self.DeviceTypeConnect,
            "DeviceValueType":self.DeviceValueType,
            "DeviceAddress":self.DeviceAddress,
            "DeviceToken":self.DeviceToken,
            "RoomId":self.room_id
        }
    def get_value(self):
        values = self.valuedevice_set.all()
        valuesDict = dict()
        for item in values:
            valuesDict[item.name]=item.value
        return valuesDict

class ValueDevice(models.Model):
    id = models.IntegerField("id", primary_key=True)
    address = models.SlugField("device config address", max_length = 200,default="")
    name = models.SlugField("device value name", max_length = 200,default="null")
    low = models.SlugField("device config low", max_length = 200, default="")
    high = models.SlugField("device config high", max_length = 200, default="")
    values = models.CharField("values", max_length = 200, default="")
    icon = models.SlugField("device icon", max_length = 200, default="")
    value = models.SlugField("device value value", max_length = 200)
    unit = models.CharField("unit", max_length = 10,default="")
    control = models.BooleanField("управление",default=True)
    type = models.SlugField("device value value", max_length = 200,default="binary")
    device = models.ForeignKey(Device, on_delete = models.CASCADE)

    def __str__(self):
        return self.name +" "+ self.value

    def receiveDictConf(self):
        return {
            "name":self.name,
            "address":self.address,
            "low":self.low,
            "high":self.high,
            "values":self.values,
            "icon":self.icon,
            "unit":self.unit,
            "type":self.type,
            "control":self.control
        }

    def receiveDict(self):
        return {
            "id":self.id,
            "name":self.name,
            "value":self.value,
        }

class ValueListDevice(models.Model):
    id = models.IntegerField("id", primary_key=True)
    name = models.SlugField("device name field", max_length = 200)
    value = models.SlugField("device value list value", max_length = 200,default="")
    date = models.DateTimeField("device value element date", auto_now=True)
    device = models.ForeignKey(Device, on_delete = models.CASCADE)

    def __str__(self):
        return self.type +" "+ self.value

    def receiveDict(self):
        return {
            "device":self.device.DeviceSystemName,
            "name":self.name,
            "value":self.value,
            "date":self.date
        }
class HomePage(models.Model):
    id = models.IntegerField("id", primary_key=True)
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
    id = models.IntegerField("id", primary_key=True)
    idInPage = models.IntegerField("id in page")
    name = models.CharField("cart name", max_length = 50)
    type = models.CharField("cart type", max_length = 20)
    order = models.IntegerField("cart order", default=10)
    homePage = models.ForeignKey(HomePage, on_delete = models.CASCADE)
    width = models.IntegerField("width",default=2)


    def __str__(self):
        return self.name

    def receiveDict(self):
        return {
            "mainId":self.id,
            "id":self.idInPage,
            "name":self.name,
            "type":self.type,
            "order":self.order,
            "width":self.width
        }

class CartChildren(models.Model):
    id = models.IntegerField("id", primary_key=True)
    name = models.CharField("element name", max_length = 50)
    type = models.CharField("element type", max_length = 20)
    typeAction = models.CharField("element typeAction", max_length = 20)
    order = models.IntegerField("element order", default=0)
    device = models.ForeignKey(Device, on_delete = models.CASCADE, null=True)
    action = models.CharField("element action", max_length = 20, default = "get")
    homeCart = models.ForeignKey(HomeCart, on_delete = models.CASCADE)
    width = models.IntegerField("width",default=1)
    height = models.IntegerField("width",default=1)

    def __str__(self):
        return self.name+" "+self.type+" "+self.typeAction

    def receiveDict(self):
        device = self.device
        if(device):
            device = device.id
        return {
            "id":self.id,
            "name":self.name,
            "type":self.type,
            "action":self.action,
            "typeAction":self.typeAction,
            "deviceId":device,
            "order":self.order,
            "width":self.width,
            "height":self.height
        }
