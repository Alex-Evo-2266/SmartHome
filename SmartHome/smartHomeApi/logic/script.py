from .runScript import runscript
from SmartHome.settings import SCRIPTS_DIR
import yaml
import os, sys


def addscript(data):
    try:
        print(data)
        fileList = os.listdir(SCRIPTS_DIR)
        str = data["name"] + ".yml"
        data["status"] = False
        if(len(data["trigger"])>0):
            data["status"] = True
        for item in fileList:
            print(item,str)
            if(item==str):
                return False
        name = os.path.join(SCRIPTS_DIR,str)
        with open(name, 'w') as f:
            yaml.dump(data, f, default_flow_style=False)
        return True
    except Exception as e:
        print(e)
        return False

def scripts():
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    for item in fileList:
        listscripts.append(script(item))
    return listscripts

def script(name):
    templates = None
    with open(os.path.join(SCRIPTS_DIR,name)) as f:
        templates = yaml.safe_load(f)
    return templates

def scriptDelete(name):
    try:
        file_path = os.path.join(SCRIPTS_DIR,name)
        file_path = file_path + ".yml"
        os.remove(file_path)
        return True
    except:
        return False

def scriptsetstatus(name,status):
    try:
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        templates["status"] = status
        with open(os.path.join(SCRIPTS_DIR,fullName), 'w') as f:
            yaml.dump(templates, f, default_flow_style=False)
        return True
    except:
        return False

def runScript(name):
    try:
        templates = None
        fullName = name + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        runscript(templates)
        return True
    except:
        return False
