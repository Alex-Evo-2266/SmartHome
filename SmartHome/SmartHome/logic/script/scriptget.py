from .runScript import runscript
from SmartHome.settings import SCRIPTS_DIR
from SmartHome.schemas.base import FunctionRespons
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def scripts()->FunctionRespons:
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    for item in fileList:
        res = script(item)
        if(res.status != 'ok'):
            res.data = None
        listscripts.append(res.data)
    return FunctionRespons(status="ok", data=listscripts)

def script(name: str)->FunctionRespons:
    try:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,name)) as f:
            templates = yaml.safe_load(f)
        return FunctionRespons(status="ok", data=templates)
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))

def runScript(name: str)->FunctionRespons:
    try:
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        runscript(templates)
        return FunctionRespons(status="ok")
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))
