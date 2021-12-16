from SmartHome.settings import DEVICETYPES
from castom_moduls import getDevices
import yaml
import os, sys
import logging

logger = logging.getLogger(__name__)

def convertFormat():
    baseTyps = ["light","switch","wireless switchs","relay","socket","sensor"]
    devices = getDevices()
    types = list()
    for key in devices:
        for item in devices[key]["typeDevices"]:
            if(baseTyps.count(item) == 0 and item != "all"):
                baseTyps.append(item)
    for item in baseTyps:
        types.append({
        "title":item,
        "interface":[]
        })
    for item in types:
        for key in devices:
            for item2 in devices[key]["typeDevices"]:
                if(item["title"] == item2 or item2 == "all"):
                    item["interface"].append(key)
    types.append({
        "title":"variable",
        "interface":["variable"]
    })
    return types

def getDeviceTypes():
    try:
        templates = convertFormat()
        # templates = None
        # with open(DEVICETYPES) as f:
        #     templates = yaml.safe_load(f)
        logger.debug(f'typs devices: {templates}')
        return {
            "status": "ok",
            "data": templates
        }
    except Exception as e:
        logger.error(f'error get type. detail:{e}')
        return {
            "status": "error",
            "detail": e
        }
