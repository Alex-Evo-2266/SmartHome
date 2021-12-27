import logging
import settings
import os, sys
import yaml
from schemas.style import StyleSchemas

logger = logging.getLogger(__name__)

async def addstyle(data: StyleSchemas):
    try:
        logger.debug(f'addstyle input. data:{data}')
        fileList = os.listdir(settings.STYLES_DIR)
        str = data.name + ".yml"
        for item in fileList:
            if(item==str):
                return {"status":"error", "detail": "уже есть"}
        name = os.path.join(settings.STYLES_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data.dict(), f, default_flow_style=False)
        return {"status":"ok", "detail": "ok"}
        logger.info(f'create style {data.name}')
    except Exception as e:
        logger.error(f'error add style. {e}')
        return {"status":"error", "detail": e}

async def getStyles():
    fileList = os.listdir(settings.STYLES_DIR)
    listscripts = list()
    for item in fileList:
        style = await getStyle(item)
        listscripts.append(StyleSchemas(**style))
    logger.debug(f'get styles')
    return listscripts

async def getStyle(name):
    templates = None
    path = os.path.join(settings.STYLES_DIR,name)
    with open(path) as f:
        templates = yaml.safe_load(f)
    return templates

async def removeStyle(name: str):
    try:
        templates = None
        if name == "light" or name == 'night':
            return {"status": "error", "detail": "base style not delete"}
        file = name + ".yml"
        path = os.path.join(settings.STYLES_DIR,file)
        os.remove(path)
        logger.info(f'delete styles {name}')
        return {"status": "ok"}
    except OSError as e:
        logger.error(f'error delete styles {name}. detail:{e}')
        return {"status": "error", "detail": "error delete file"}
