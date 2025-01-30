import importlib
import subprocess
import sys
import logging

from .metaModules import ModulesMeta

logger = logging.getLogger(__name__)

class BaseModule(metaclass=ModulesMeta, scan_module=False):
    formaters = []

    @classmethod
    def start(cls):
        pass

    @classmethod
    def stop(cls):
        pass