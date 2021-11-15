from SmartHome.settings import PAGES_DIR
import yaml
import os, sys

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
    print(name,fileList)
    for item in fileList:
        if(item==name):
            return {"data":item, "type":"ok"}
    return {"message":"no file", "type":"error"}

def addHomePage(name):
    try:
        fileList = os.listdir(PAGES_DIR)
        str = name + ".yml"
        for item in fileList:
            if(item==str):
                return {"type":"error","message":"this name busy"}
        path = os.path.join(PAGES_DIR,str)
        with open(path, 'w') as f:
            yaml.dump({"name":name,"cards":[]}, f, default_flow_style=False)
        return {"type":"ok","message":""}
    except Exception as e:
        print(e)
        return {"type":"error","message":e}

def deleteHomePage(name):
    try:
        file_path = os.path.join(PAGES_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        return {"type":"ok","message":""}
    except Exception as e:
        return {"type":"error","message":e}

def setPage(data):
    print(data)
    str = data["name"] + ".yml"
    path = os.path.join(PAGES_DIR,str)
    with open(path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
    return True


def getPage(name):
    templates = None
    name = name + ".yml"
    res = lookForPage(name)
    if(res["type"]=="ok"):
        with open(os.path.join(PAGES_DIR,name)) as f:
            templates = yaml.safe_load(f)
        return {"data":templates,"type":"ok"}
    else:
        return res

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
