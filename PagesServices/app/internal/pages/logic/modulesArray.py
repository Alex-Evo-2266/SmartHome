import os, importlib

def getModuls(dir=__name__, init = True):
    list_modules=os.listdir(dir)
    if not init and '__init__.py' in list_modules:
        list_modules.remove('__init__.py')
    if "__pycache__" in list_modules:
        list_modules.remove("__pycache__")
    return list_modules

class ModulesArray():

    madules = {}

    @classmethod
    def initModules(cls, name:str):
        path = os.sep.join(name.split('.'))
        modules_name = getModuls(path, False)
        for module_name in modules_name:
            module = importlib.import_module(name + "." + module_name)
            cls.register(module_name, module.Module)

    @classmethod
    def register(cls, name, module):
        cls.madules[name] = module

    @classmethod
    def start(cls):
        for name in cls.madules:
            cls.madules[name].start()

    @classmethod
    def stop(cls):
        for name in cls.madules:
            cls.madules[name].stop()

    @classmethod
    def forEtch(cls, clallback):
        for name in cls.madules:
            clallback(cls.madules[name])

    @classmethod
    def get(cls, name_module: str):
        return cls.madules[name_module]