import imp,os,logging
from fastapi import APIRouter
# from .models_schema import TypeDevice, DeviceData, ModelAPIData, ModelData

devices = dict()
modules = {}

logger = logging.getLogger(__name__)

def getModule(data: list, name: str):
    for item in data:
        info = item.getInfo()
        if(info.name == name):
            return item
    return None

def getsequence(data: list, name: str):
    Module = getModule(data, name)
    if not Module:
        raise ModuleNotFoundError
    info = Module.getInfo()
    moduleq = 1
    if not len(info.dependencies):
        return 1
    for item in info.dependencies:
        newq = getsequence(data, item)
        if moduleq < newq:
            moduleq = newq
    return 1 +  moduleq

def module_sequence(data: list):
    moduls_dict = dict()
    data2 = data
    for module in data:
        info = module.getInfo()
        moduls_dict[info.name] = {"module":module ,"order": getsequence(data2, info.name)}
    return moduls_dict

def dict_to_list(data: dict):
    arr = list()
    for key in data:
        arr.append({"name": key, **data[key]})
    return arr

def deviceType(module):
    global devices
    items = module.getItems()
    if items and "devices" in items:
        moduldevices = items["devices"]
        for item in moduldevices:
            devices[item.name] = {
                "class":item.deviceClass,
                "typeDevices":item.typeDevices
            }


def getModuls(dir="castom_moduls"):
    list_modules=os.listdir(dir)
    list_modules.remove('__init__.py')
    # list_modules.remove('Zigbee')
    flag = False
    for item in list_modules:
        if(item == "__pycache__"):
            flag = True
    if flag:
        list_modules.remove('__pycache__')
    return list_modules

def __load_all__(dir="castom_moduls"):
    list_modules = getModuls(dir)
    list_model_control = list()
    for module_name in list_modules:
        list_modules_2=os.listdir(dir+os.sep+module_name)
        if(list_modules_2.count("__init__.py") == 1):
            foo = imp.load_source('module', dir+os.sep+module_name+os.sep+"__init__.py")
            module = foo.ModuleControll()
            deviceType(module)
            list_model_control.append(module)
    moduls = module_sequence(list_model_control)
    moduls = dict_to_list(moduls)
    moduls2 = moduls.copy()
    q = 1
    while len(moduls2) > 0:
        for item in moduls:
            if(item["order"] == q):
                m = item["module"]
                m.start()
                modules[item["name"]] = m
                moduls2.remove(item)
        q = q + 1
        moduls = moduls2.copy()

def getPages():
    arr = list()
    for key in modules:
        m = modules[key]
        data = m.getPages()
        if data:
            arr.append(data)
    return arr

def init_moduls():
    __load_all__()

def init_routers(dir="castom_moduls"):
    import copy
    list_modules = getModuls(dir)
    list_routers = list()
    for module_name in list_modules:
        try:
            list_modules_2=os.listdir(dir+os.sep+module_name)
            if(list_modules_2.count("__init__.py") == 1):
                foo = imp.load_source('module', dir+os.sep+module_name+os.sep+"__init__.py")
                module = foo.ModuleControll()
                router = module.getRouter()
                if router:
                    list_routers.append(router)
        except Exception as e:
            logger.error(f"error import router. detail:{e}")
    return list_routers

async def getDevicesClass(type, systemName):
    global devices
    if(type in devices):
        p = devices[type]
        deviceClass = p["class"]
        res = deviceClass(systemName=systemName)
        return res
    return None

def getDevices():
    return devices
