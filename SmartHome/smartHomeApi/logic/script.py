from .runScript import runscript
from SmartHome.settings import SCRIPTS_DIR
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)


def addscript(data):
    try:
        logger.debug(f'add script input data:{data} ')
        fileList = os.listdir(SCRIPTS_DIR)
        str = data["name"] + ".yml"
        data["status"] = False
        if(len(data["trigger"])>0):
            data["status"] = True
        for item in fileList:
            if(item==str):
                return {'status':'error', 'detail':'a script with the same name already exists.'}
        name = os.path.join(SCRIPTS_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return {'status':'ok'}
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return {'status':'error', 'detail':e}

def scripts():
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    for item in fileList:
        res = script(item)
        if('status' in res):
            if(res['status'] != 'ok'):
                res = None
        listscripts.append(res)
    return listscripts

def script(name):
    try:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,name)) as f:
            templates = yaml.safe_load(f)
        return templates
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return {'status':'error', 'detail':e}


def scriptDelete(name):
    try:
        logger.debug(f'delete script. script:{name}')
        file_path = os.path.join(SCRIPTS_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f'error delete script. file:{name}. detail:{e}')
        return {'status':'error', 'detail':e}

def scriptsetstatus(name,status):
    try:
        logger.debug(f'edit status script. script:{name}, status:{status}')
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        templates["status"] = status
        with open(os.path.join(SCRIPTS_DIR,fullName), 'w') as f:
            yaml.dump(templates, f, default_flow_style=False)
        return {'status':'ok'}
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return {'status':'error', 'detail':e}

def runScript(name):
    try:
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        runscript(templates)
        return {'status':'ok'}
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        return {'status':'error', 'detail':e}
