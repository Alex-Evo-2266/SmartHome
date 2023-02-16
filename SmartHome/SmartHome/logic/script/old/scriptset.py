# from .runScript import runscript
from settings import SCRIPTS_DIR
from SmartHome.schemas.script import ScriptSchema
from SmartHome.schemas.base import FunctionRespons
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def addscript(dataobj: ScriptSchema)->FunctionRespons:
    try:
        data = dataobj.dict()
        logger.debug(f'add script input data:{data} ')
        fileList = os.listdir(SCRIPTS_DIR)
        str = data["name"] + ".yml"
        data["status"] = False
        if(len(data["trigger"])>0):
            data["status"] = True
        for item in fileList:
            if(item==str):
                return FunctionRespons(status="error",detail='a script with the same name already exists.')
        name = os.path.join(SCRIPTS_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return FunctionRespons(status="ok")
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))

def scriptDelete(name:str)->FunctionRespons:
    try:
        logger.debug(f'delete script. script:{name}')
        file_path = os.path.join(SCRIPTS_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        return FunctionRespons(status="ok")
    except Exception as e:
        logger.error(f'error delete script. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))

def scriptsetstatus(name: str, status:bool)->FunctionRespons:
    try:
        logger.debug(f'edit status script. script:{name}, status:{status}')
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        templates["status"] = status
        with open(os.path.join(SCRIPTS_DIR,fullName), 'w') as f:
            yaml.dump(templates, f, default_flow_style=False)
        return FunctionRespons(status="ok")
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return FunctionRespons(status="error", detail=str(e))
