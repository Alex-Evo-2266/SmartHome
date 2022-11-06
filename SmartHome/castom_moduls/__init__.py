import imp,os,logging
import copy
import subprocess
from fastapi import APIRouter
from moduls_src.services import add
# from .models_schema import TypeDevice, DeviceData, ModelAPIData, ModelData

# devices = dict()
# modules = dict()

logger = logging.getLogger(__name__)

# def getModuls(dir=__name__, init = True):
#     list_modules=os.listdir(dir)
#     if not init and '__init__.py' in list_modules:
#         list_modules.remove('__init__.py')
#     if "__pycache__" in list_modules:
#         list_modules.remove("__pycache__")
#     return list_modules

# def dict_to_list(data: dict):
#     arr = list()
#     for key in data:
#         arr.append({"name": key, **data[key]})
#     return arr

# def __init_service__(dir=__name__):
#     list_modules = getModuls(dir, False)
#     for module in list_modules:
#         list_dirs = getModuls(dir+os.sep+module, False)
#         if "services" in list_dirs:
#             service_file = [_ for _ in os.listdir(dir+os.sep+module+os.sep+"services") if _.endswith(r".py")]
#             for service in service_file:
#                 foo = imp.load_source('module', "castom_moduls"+os.sep+module+os.sep+"services"+os.sep+service)
#                 add(module+"_"+service.split(".")[0], copy.copy(foo.Service()))

# def __init_device__(dir=__name__):
#     list_modules = getModuls(dir, False)
#     global devices
#     for module in list_modules:
#         list_dirs = getModuls(dir+os.sep+module, False)
#         if "devices" in list_dirs:
#             dev_file = [_ for _ in os.listdir(dir+os.sep+module+os.sep+"devices") if _.endswith(r".py")]
#             for dev in dev_file:
#                 foo = imp.load_source('module', "castom_moduls"+os.sep+module+os.sep+"devices"+os.sep+dev)
#                 name_device = module+"_"+dev.split(".")[0]
#                 if foo.Device.name:
#                     name_device = foo.Device.name
#                 devices[name_device] = {
#                     "class":foo.Device,
#                     "typeDevices":foo.Device.typesDevice
#                 }

# def addlib(dir=__name__):
#     list_modules = getModuls(dir, False)
#     for module in list_modules:
#         list_dirs = getModuls(dir+os.sep+module)
#         if "__init__.py" in list_dirs:
#             foo = imp.load_source('module', "castom_moduls"+os.sep+module+os.sep+"__init__.py")
#             d = ["poetry", "add"] + foo.Module.dependencies
#             if len(d) > 2:
#                 subprocess.run(d)

# def __load_all__(dir=__name__):
#     __init_device__(dir)
#     __init_service__(dir)
#     list_modules = getModuls(dir, False)
#     for module in list_modules:
#         list_dirs = getModuls(dir+os.sep+module)
#         if "__init__.py" in list_dirs:
#             foo = imp.load_source('module', "castom_moduls"+os.sep+module+os.sep+"__init__.py")
#             modules[module] = copy.copy(foo.Module())
#             modules[module].start()

# def getPages():
#     arr = list()
#     return arr

# def init_moduls():
#     __load_all__()
#     # list_files = subprocess.run(["poetry", "show"], stdout=subprocess.PIPE, text=True)
#     # list_files = subprocess.run(["poetry", "add", "yeelight"], stdout=subprocess.DEVNULL)
#     # print(list_files)

# def init_routers(dir=__name__):
#     addlib()
#     list_modules = getModuls(dir, False)
#     list_routers = list()
#     for module in list_modules:
#         list_dirs = getModuls(dir+os.sep+module, False)
#         if "routs" in list_dirs:
#             rout_file = [_ for _ in os.listdir(dir+os.sep+module+os.sep+"routs") if _.endswith(r".py")]
#             for rout in rout_file:
#                 foo = imp.load_source('module', "castom_moduls"+os.sep+module+os.sep+"routs"+os.sep+rout)
#                 list_routers.append(copy.copy(foo.router))
#     return list_routers

# async def getDevicesClass(type, systemName):
#     global devices
#     if(type in devices):
#         p = devices[type]
#         deviceClass = p["class"]
#         res = deviceClass(systemName=systemName)
#         return res
#     return None

# def getDevices():
#     global devices
#     print(devices)
#     return devices


async def init_modules():
    pass