from settings import SCRIPTS_DIR
from SmartHome.schemas.script import ScriptSchema, ScriptStatus
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def get_script_by_filename(file_name: str):
    try:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,file_name)) as f:
            templates = yaml.safe_load(f)
        print(templates)
        return ScriptSchema(**templates)
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{file_name}. detail:{e}')
        raise

def get_script(name: str):
    try:
        file_name = os.path.join(name, ".yml")
        get_script_by_filename(file_name)
    except FileNotFoundError as e:
        logger.error(f'file not found. file:{name}. detail:{e}')
        raise

def get_script_all():
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    for item in fileList:
        res = get_script_by_filename(item)
        listscripts.append(res)
    return listscripts