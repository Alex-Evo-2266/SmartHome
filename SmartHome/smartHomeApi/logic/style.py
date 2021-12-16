from SmartHome.settings import STYLES_DIR
import yaml, logging
import os, sys

logger = logging.getLogger(__name__)

def addstyle(data):
    try:
        logger.debug(f'addstyle input. data:{data}')
        fileList = os.listdir(STYLES_DIR)
        str = data["name"] + ".yml"
        for item in fileList:
            if(item==str):
                return {"status":"error", "detail": "уже есть"}
        name = os.path.join(STYLES_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return {"status":"ok", "detail": "ok"}
        logger.info(f'create style {data["name"]}')
    except Exception as e:
        logger.error(f'error add style. {e}')
        return {"status":"error", "detail": e}

def getStyles():
    fileList = os.listdir(STYLES_DIR)
    listscripts = list()
    for item in fileList:
        listscripts.append(getStyle(item))
    logger.debug(f'get styles')
    return listscripts

def getStyle(name):
    templates = None
    path = os.path.join(STYLES_DIR,name)
    with open(path) as f:
        templates = yaml.safe_load(f)
    return templates

def removeStyle(name):
    try:
        templates = None
        file = name + ".yml"
        path = os.path.join(STYLES_DIR,file)
        os.remove(path)
        logger.info(f'delete styles {name}')
    except OSError as e:
        logger.error(f'error delete styles {name}. detail:{e}')
