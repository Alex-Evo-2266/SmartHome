from SmartHome.settings import PAGES_DIR
from SmartHome.schemas.base import FunctionRespons
from SmartHome.schemas.homePage import HomePage, HomeCard, CardChildren
from typing import Optional, List, Dict
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def lookForPage(name: str)->FunctionRespons:
    fileList = os.listdir(PAGES_DIR)
    logger.debug(f'lookForPage -> input data:{name}')
    for item in fileList:
        if(item==name):
            return FunctionRespons(data=item, status="ok")
    return FunctionRespons(detail="no file", status="error")

def childrensFormat(data: list)->List[CardChildren]:
    arr = list()
    for item in data:
        arr.append(CardChildren(**item))
    return arr

def cardsFormat(data: list)->List[HomeCard]:
    arr = list()
    for item in data:
        item['children'] = childrensFormat(item['children'])
        arr.append(HomeCard(**item))
    return arr

def getPagesName()->FunctionRespons:
    fileList = os.listdir(PAGES_DIR)
    arr = []
    templates = None
    for item in fileList:
        with open(os.path.join(PAGES_DIR,item)) as f:
            templates = yaml.safe_load(f)
        arr.append(templates["name"])
    return FunctionRespons(status="ok", data=arr)

def setPage(data: HomePage)->FunctionRespons:
    try:
        logger.debug(f"setPage -> input data:{data.dict()}")
        str = data.name + ".yml"
        path = os.path.join(PAGES_DIR,str)
        with open(path, 'w') as f:
            yaml.dump(data.dict(), f, default_flow_style=False)
        return FunctionRespons(status="ok", data=None)
    except FileNotFoundError as e:
        logger.error(f"file not found file:{data.name}, detail:{e}")
        return FunctionRespons(status="error", ditail=f'file not found. detile: {str(e)}')

def getPage(name: str)->FunctionRespons:
    try:
        templates = None
        name = name + ".yml"
        res = lookForPage(name)
        if(res.status=="ok"):
            with open(os.path.join(PAGES_DIR,name)) as f:
                templates = yaml.safe_load(f)
            return FunctionRespons(data=HomePage(
            name=templates['name'],
            cards=cardsFormat(templates['cards'])
            ), status="ok")
        else:
            return res
    except FileNotFoundError as e:
        logger.error(f"file not found file:{name}, detail:{e}")
        return FunctionRespons(status="error", detail=e)

def addHomePage(name: str)->FunctionRespons:
    try:
        logger.debug(f"addHomePage -> input name:{name}")
        fileList = os.listdir(PAGES_DIR)
        str = name + ".yml"
        for item in fileList:
            if(item==str):
                return FunctionRespons(status="error",detail="this name busy")
        path = os.path.join(PAGES_DIR,str)
        with open(path, 'w') as f:
            yaml.dump({"name":name,"cards":[]}, f, default_flow_style=False)
        logger.info(f"add new page name:{name}")
        return FunctionRespons(status="ok", detail="")
    except FileNotFoundError as e:
        logger.error(f"file not found file:{str}, detail:{e}")
        return FunctionRespons(status="error", detail=str(e))

def deleteHomePage(name: str)->FunctionRespons:
    try:
        file_path = os.path.join(PAGES_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        logger.info(f"delete page name:{name}")
        return FunctionRespons(status="ok", detail="")
    except Exception as e:
        logger.error(f"error delete page name:{name}, detail:{e}")
        return FunctionRespons(status="error", detail=str(e))

def deleteDevice(name: str)->FunctionRespons:
    try:
        pages = getPagesName()
        if pages.status != "ok":
            return FunctionRespons(status="error", detail=f"error delete device name:{name}")
        for page in pages.data:
            datapage = getPage(page)
            if datapage.status == "ok":
                data = datapage.data
                for card in data.cards:
                    filt = [x for x in card.children if x.deviceName != name]
                    card.children = filt
            setPage(data)
            return FunctionRespons(status="ok", data="ok")
    except Exception as e:
        logger.error(f"error delete device name:{name}, detail:{e}")
        return FunctionRespons(status="error", detail=str(e))
