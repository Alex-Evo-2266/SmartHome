from SmartHome.settings import PAGES_DIR
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def getPages():
    fileList = os.listdir(PAGES_DIR)
    arr = []
    templates = None
    for item in fileList:
        with open(os.path.join(PAGES_DIR,item)) as f:
            templates = yaml.safe_load(f)
        arr.append(templates["name"])
    return {"data":arr, "type":"ok"}

def lookForPage(name):
    fileList = os.listdir(PAGES_DIR)
    logger.debug(f'lookForPage -> input data:{name}')
    for item in fileList:
        if(item==name):
            return {"data":item, "type":"ok"}
    return {"detail":"no file", "type":"error"}

def addHomePage(name):
    try:
        logger.debug(f"addHomePage -> input name:{name}")
        fileList = os.listdir(PAGES_DIR)
        str = name + ".yml"
        for item in fileList:
            if(item==str):
                return {"type":"error","detail":"this name busy"}
        path = os.path.join(PAGES_DIR,str)
        with open(path, 'w') as f:
            yaml.dump({"name":name,"cards":[]}, f, default_flow_style=False)
        logger.info(f"add new page name:{name}")
        return {"type":"ok","detail":""}
    except FileNotFoundError as e:
        logger.error(f"file not found file:{str}, detail:{e}")
        return {"status":"error", "detail":e}

def deleteHomePage(name):
    try:
        file_path = os.path.join(PAGES_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        logger.info(f"delete page name:{name}")
        return {"type":"ok","detail":""}
    except Exception as e:
        logger.error(f"error delete page name:{name}, detail:{e}")
        return {"type":"error","detail":e}

def setPage(data):
    logger.debug(f"setPage -> input data:{data}")
    str = data["name"] + ".yml"
    path = os.path.join(PAGES_DIR,str)
    with open(path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
    return True


def getPage(name):
    try:
        templates = None
        name = name + ".yml"
        res = lookForPage(name)
        if(res["type"]=="ok"):
            with open(os.path.join(PAGES_DIR,name)) as f:
                templates = yaml.safe_load(f)
            return {"data":templates,"type":"ok"}
        else:
            return res
    except FileNotFoundError as e:
        logger.error(f"file not found file:{name}, detail:{e}")
        return {"status":"error", "detail":e}


def deleteDeviceCart(id):
    pages = getPages().get("data")
    for item in pages:
        page = getPage(item).get("data")
        for card in page["cards"]:
            delel = list()
            for element in card["children"]:
                if("deviceId" in element and element.get("deviceId") == id):
                    delel.append(element)
            for item2 in delel:
                card["children"].remove(item2)
        setPage(page)
