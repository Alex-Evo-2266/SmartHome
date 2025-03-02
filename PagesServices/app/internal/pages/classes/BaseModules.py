from .ModulesMeta import ModulesMeta

sep = '.'

class BaseModule(metaclass=ModulesMeta, scan_module=False):
    formaters = []
    pages_path = {}
    router=[]
    menu_path={}
    dialogs_path={}

    @classmethod
    def start(cls):
        pass

    @classmethod
    def stop(cls):
        pass
