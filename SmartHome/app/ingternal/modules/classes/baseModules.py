import importlib
import subprocess
import sys
import logging

from .metaModules import ModulesMeta

logger = logging.getLogger(__name__)

class BaseModule(metaclass=ModulesMeta, scan_module=False):
    formaters = []

    @classmethod
    async def start(cls):
        pass

    @classmethod
    async def stop(cls):
        pass