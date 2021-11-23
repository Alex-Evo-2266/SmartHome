import imp,os

devices = dict()

def deviceType(module):
    info = module.getInfo()
    moduldevices = info["devices"]
    for item in moduldevices:
        devices[item["name"]] = {
            "class":item["class"],
            "typeDevices":item["typeDevices"]
        }

def __load_all__(dir="castom_moduls"):
    list_modules=os.listdir(dir)
    list_modules.remove('__init__.py')
    flag = False
    for item in list_modules:
        if(item == "__pycache__"):
            flag = True
    if flag:
        list_modules.remove('__pycache__')
    for module_name in list_modules:
        list_modules_2=os.listdir(dir+os.sep+module_name)
        if(list_modules_2.count("__init__.py") == 1):
            foo = imp.load_source('module', dir+os.sep+module_name+os.sep+"__init__.py")
            info = foo.getInfo()
            if(info["type"] == "device"):
                deviceType(foo)

__load_all__()

def getDevicesClass(type, id):
    if(type in devices):
        p = devices[type]
        deviceClass = p["class"]
        return deviceClass(id=id)
    return None

def getDevices():
    return devices
