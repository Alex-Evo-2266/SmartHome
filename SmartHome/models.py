import ormar
from dbtest import BaseMeta
from typing import Optional, List

def set_to_list_dict(items):
    item_list = list()
    for item in items:
        item_list.append(item.model_to_dict())
    return item_list

def set_dict_ro_null(item):
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


class LocalImage(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title: str = ormar.String(max_length=200, nullable=False)
    image: str = ormar.String(max_length=200, nullable=False)
    # image = models.ImageField("Изображение",upload_to="public")

    def model_to_dict(self):
        return {
        "id":self.id,
        "title":self.title,
        "image":self.image.url,
        }

    def __str__(self):
        return self.title

class ImageBackground(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    type: str = ormar.String(max_length=200, default="base")
    image: Optional[LocalImage] = ormar.ForeignKey(LocalImage, nullable=True)

    def model_to_dict(self):
        return {**self.image.model_to_dict(),"type":self.type}
# Create your models here.
class User(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    UserName: str = ormar.String(max_length=200, nullable=False)
    UserSurname: str = ormar.String(max_length=200, nullable=True)
    UserPassword: str = ormar.String(max_length=200, nullable=False)
    UserEmail: str = ormar.String(max_length=200, nullable=False)
    UserMobile: str = ormar.String(max_length=200, nullable=False)
    UserLevel: int = ormar.Integer(default=1)
    Style: str = ormar.String(max_length=200, default="light")
    auteStyle: bool = ormar.Boolean(default=True)
    staticBackground: bool = ormar.Boolean(default=False)
    background: Optional[List[ImageBackground]] = ormar.ManyToMany(ImageBackground)
    page: str = ormar.String(max_length=200, default="basePage")

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

# class UserConfig(BaseModel):
#
#
#     def __str__(self):
#         return self.Style
#
#     def get(self):
#         return {
#         "Style":self.Style,
#         "autoStyle":self.auteStyle,
#         "page":self.page,
#         "staticBackground":self.staticBackground,
#         "images":set_to_list_dict(self.background.all())
#         }

class MenuElement(ormar.Model):
    class Meta(BaseMeta):
        pass

    id: int = ormar.Integer(primary_key=True)
    title:str = ormar.String(max_length=200)
    iconClass:str = ormar.String(max_length=200, default="fab fa-chrome")
    url:str = ormar.String(max_length=200)
    user: Optional[User] = ormar.ForeignKey(User)

    def model_to_dict(self):
        return{
        "title":self.title,
        "iconClass":self.iconClass,
        "url":self.url
        }

# class Device(models.Model):
#     id = models.IntegerField("id", primary_key=True)
#     DeviceStatus = models.BooleanField("статус",default=True)
#     DeviceName = models.CharField("device name", max_length = 200)
#     DeviceSystemName = models.SlugField("device system name", max_length = 200)
#     DeviceAddress = models.SlugField("device address", max_length = 200, default="")
#     DeviceToken = models.SlugField("device token", max_length = 200, default="")
#     DeviceInformation = models.TextField("device info", default="")
#     DeviceType = models.SlugField("device type", max_length = 200, default="")
#     DeviceTypeConnect = models.SlugField("device connect type", max_length = 200, default="")
#     DeviceValueType = models.SlugField("device value type", max_length = 200, default="json")
#     DeviceControl= models.TextField("device control", max_length = 200, default="")
#     room = models.ForeignKey(Room, on_delete = models.SET_NULL, null=True)
#
#     def __str__(self):
#         return self.DeviceName + ", " + self.DeviceControl
#
#     def receiveDict(self):
        # return {
        #     "DeviceId":self.id,
        #     "DeviceStatus":self.DeviceStatus,
        #     "DeviceName":self.DeviceName,
        #     "DeviceSystemName":self.DeviceSystemName,
        #     "DeviceInformation":self.DeviceInformation,
        #     "DeviceType":self.DeviceType,
        #     "DeviceTypeConnect":self.DeviceTypeConnect,
        #     "DeviceValueType":self.DeviceValueType,
        #     "DeviceAddress":self.DeviceAddress,
        #     "DeviceToken":self.DeviceToken,
        #     "RoomId":self.room_id
        # }
    # def get_value(self):
    #     values = self.valuedevice_set.all()
    #     valuesDict = dict()
    #     for item in values:
    #         valuesDict[item.name]=item.value
    #     return valuesDict
#
# class ValueDevice(models.Model):
#     id = models.IntegerField("id", primary_key=True)
#     address = models.SlugField("device config address", max_length = 200,default="")
#     name = models.SlugField("device value name", max_length = 200,default="null")
#     low = models.SlugField("device config low", max_length = 200, default="")
#     high = models.SlugField("device config high", max_length = 200, default="")
#     values = models.CharField("values", max_length = 200, default="")
#     icon = models.SlugField("device icon", max_length = 200, default="")
#     value = models.SlugField("device value value", max_length = 200)
#     unit = models.CharField("unit", max_length = 10,default="")
#     control = models.BooleanField("управление",default=True)
#     type = models.SlugField("device value value", max_length = 200,default="binary")
#     device = models.ForeignKey(Device, on_delete = models.CASCADE)
#
#     def __str__(self):
#         return self.name +" "+ self.value
#
#     def receiveDictConf(self):
#         return {
#             "name":self.name,
#             "address":self.address,
#             "low":self.low,
#             "high":self.high,
#             "values":self.values,
#             "icon":self.icon,
#             "unit":self.unit,
#             "type":self.type,
#             "control":self.control,
#             "value":self.value
#         }
#
#     def toDict(self):
#         return {
#             "name":self.name,
#             "address":self.address,
#             "low":self.low,
#             "high":self.high,
#             "values":self.values,
#             "icon":self.icon,
#             "unit":self.unit,
#             "type":self.type,
#             "control":self.control,
#             "value":self.value
#         }
#
#     def receiveDict(self):
#         return {
#             "id":self.id,
#             "name":self.name,
#             "value":self.value,
#         }
#
# class ValueListDevice(models.Model):
#     id = models.IntegerField("id", primary_key=True)
#     name = models.SlugField("device name field", max_length = 200)
#     value = models.SlugField("device value list value", max_length = 200,default="")
#     date = models.DateTimeField("device value element date", auto_now=True)
#     device = models.ForeignKey(Device, on_delete = models.CASCADE)
#
#     def __str__(self):
#         return self.type +" "+ self.value
#
#     def receiveDict(self):
#         return {
#             "device":self.device.DeviceSystemName,
#             "name":self.name,
#             "value":self.value,
#             "date":self.date
#         }
