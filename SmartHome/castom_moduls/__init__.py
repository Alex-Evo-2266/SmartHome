import imp,os
from fastapi import APIRouter
from .models_schema import TypeDevice, DeviceData, ModelAPIData, ModelData

devices = dict()

def deviceType(module):
    info = module.getInfo()
    moduldevices = info.deviceType
    for item in moduldevices:
        devices[item.name] = {
            "class":item.deviceClass,
            "typeDevices":item.typeDevices
        }

def getModuls(dir="castom_moduls"):
    list_modules=os.listdir(dir)
    list_modules.remove('__init__.py')
    list_modules.remove('models_schema.py')
    flag = False
    for item in list_modules:
        if(item == "__pycache__"):
            flag = True
    if flag:
        list_modules.remove('__pycache__')
    return list_modules

def __load_all__(dir="castom_moduls"):
    list_modules = getModuls(dir)
    for module_name in list_modules:
        list_modules_2=os.listdir(dir+os.sep+module_name)
        if(list_modules_2.count("__init__.py") == 1):
            foo = imp.load_source('module', dir+os.sep+module_name+os.sep+"__init__.py")
            info = foo.init()
            if(info.deviceType != None):
                deviceType(foo)

def init_moduls():
    __load_all__()

def init_routers(dir="castom_moduls"):
    list_modules = getModuls(dir)
    list_routers = list()
    for module_name in list_modules:
        list_modules_2=os.listdir(dir+os.sep+module_name)
        if(list_modules_2.count("__init__.py") == 1):
            foo = imp.load_source('module', dir+os.sep+module_name+os.sep+"__init__.py")
            info = foo.getInfo()
            if info.router and isinstance(info.router, APIRouter):
                list_routers.append(info.router)
    return list_routers

async def getDevicesClass(type, systemName):
    if(type in devices):
        p = devices[type]
        deviceClass = p["class"]
        res = deviceClass(systemName=systemName)
        return res
    return None

def getDevices():
    return devices
