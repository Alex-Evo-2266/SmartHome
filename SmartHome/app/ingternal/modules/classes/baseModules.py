from .metaModules import ModulesMeta

sep = '.'

class BaseModule(metaclass=ModulesMeta, scan_module=False):
    formaters = []

    @classmethod
    def start(cls):
        pass

    @classmethod
    def stop(cls):
        pass
