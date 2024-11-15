import os, importlib
from ..classes.baseServiceInterface import IBaseService

class ServiceArray():

    services:dict[str, IBaseService] = {}

    @classmethod
    def register(cls, key, module):
        cls.services[key] = module

    @classmethod
    async def start(cls):
        for key in cls.services:
            await cls.services[key].start()

    @classmethod
    async def stop(cls):
        for key in cls.services:
            await cls.services[key].stop()

    @classmethod
    def get(cls, name_module: str):
        return cls.services[name_module]
