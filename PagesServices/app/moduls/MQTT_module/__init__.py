
from app.internal.pages.classes.BaseModules import BaseModule
from . import formaters

class Module(BaseModule):

    formaters=formaters.formaters

    @classmethod
    def start(cls, *args, **kwargs):
        super().start(*args, **kwargs)

    @classmethod
    def stop(cls, *args, **kwargs):
        super().stop(*args, **kwargs)
