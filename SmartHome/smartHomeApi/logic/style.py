from SmartHome.settings import STYLES_DIR
import yaml
import os, sys

def addstyle(data):
    try:
        print(data)
        fileList = os.listdir(STYLES_DIR)
        str = data["name"] + ".yml"
        for item in fileList:
            print(item,str)
            if(item==str):
                return {"status":"error", "message": "уже есть"}
        name = os.path.join(STYLES_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return {"status":"ok", "message": "ok"}
    except Exception as e:
        print(e)
        return {"status":"error", "message": "чтото не так"}

def getStyles():
    fileList = os.listdir(STYLES_DIR)
    listscripts = list()
    for item in fileList:
        listscripts.append(getStyle(item))
    return listscripts

def getStyle(name):
    templates = None
    path = os.path.join(STYLES_DIR,name)
    print(path)
    with open(path) as f:
        templates = yaml.safe_load(f)
    return templates

def removeStyle(name):
    templates = None
    name = name + ".yml"
    path = os.path.join(STYLES_DIR,name)
    print(path)
    os.remove(path)
