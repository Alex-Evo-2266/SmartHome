from .deviceSetValue import setValue
from SmartHome.settings import SCRIPTS_DIR
import os, sys
import yaml
import threading
import time
from datetime import datetime
from ..classes.devicesArrey import DevicesArrey

devicesArrey = DevicesArrey()
hour = 0;
month = 13;

def runTimeScript():
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    now = datetime.now()
    for item in fileList:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,item)) as f:
            templates = yaml.safe_load(f)
        trig = templates["trigger"]
        for item2 in trig:
            if("action" in item2 and "frequency" in item2["action"]):
                if(item2["action"]["frequency"] == "everyday" and "time" in item2["action"]):
                    time = "{:%H:%M}".format(now)
                    if(item2["action"]["time"] == time):
                        runscript(templates)
                elif(item2["action"]["frequency"] == "everyhour"):
                    global hour
                    if(now.hour != hour):
                        hour = now.hour
                        runscript(templates)
                elif(item2["action"]["frequency"] == "everyweek" and "time" in item2["action"] and "date" in item2["action"]):
                    time = "{:%H:%M}".format(now)
                    if(str(now.weekday() + 1) == item2["action"]["date"] and item2["action"]["time"] == time):
                        runscript(templates)
                elif(item2["action"]["frequency"] == "everymonth" and "time" in item2["action"] and "date" in item2["action"]):
                    global month
                    time = "{:%H:%M}".format(now)
                    if(month != str(now.month) and str(now.day) == item2["action"]["date"] and item2["action"]["time"] == time):
                        month = now.month
                        runscript(templates)

def runScripts(systemName,type):
    try:
        scripts = lockforScript(systemName,type)
        for item in scripts:
            templates = None
            fullName = item + ".yml"
            with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
                templates = yaml.safe_load(f)
            runscript(templates)
    except Exception as e:
        print("run script error", e) 


def runscript(data):
    print("p1")
    def d():
        print("p2")
        if(ifgroup(data["if"])):
            print("ok")
            actiondev(data["then"])
        else:
            print("none")
            actiondev(data["else"])
    s = threading.Thread(target=d)
    s.daemon = True
    s.start()

def ifgroup(data):
    retArrey = list()
    blocks = list()
    elements = list()
    children = data["children"]
    for item in children:
        if(item["type"]=="group"):
            blocks.append(item)
        if(item["type"]=="device"):
            elements.append(item)
    for item in blocks:
        retArrey.append(ifgroup(item))
    for item in elements:
        retArrey.append(ifblock(item))
    if(data["oper"]=="and"):
        for item in retArrey:
            if not item:
                return False
        return True
    elif(data["oper"]=="or"):
        for item in retArrey:
            if item:
                return True
        return False
    else:
        return False

def ifblock(data):
    try:
        if(data["type"]=="device"):
            systemName = data["systemName"]
            device = devicesArrey.get(systemName)
            device = device["device"]
            values = device.values
            for item in values:
                if(item.name == data["action"]):
                    if(data["value"]):
                        val = getvalue(data["value"],{"type":item.type})
                        rval = item.get()
                        if(rval=="on"):
                            rval="1"
                        elif(rval=="off"):
                            rval="0"
                        if(data["oper"]==">"):
                            val = int(val)
                            realval = int(rval)
                            return realval > val
                        if(data["oper"]==">="):
                            val = int(val)
                            realval = int(rval)
                            return realval >= val
                        if(data["oper"]=="<"):
                            val = int(val)
                            realval = int(rval)
                            return realval < val
                        if(data["oper"]=="<="):
                            val = int(val)
                            realval = int(rval)
                            return realval <= val
                        if(data["oper"]=="=="):
                            return str(rval) == str(val)
                        if(data["oper"]=="!="):
                            return str(rval) != str(val)
                    else:
                        return False
        return False
    except Exception as e:
        print(e)
        return False

def getvalue(data,option):
    type = None
    oldValue = None
    if(("device" in option) and ("field" in option)):
        field = None
        for item in option["device"].values:
            if(item.name==option["field"]):
                type = item.type
                oldValue = item.get()
                break
    if("type" in option):
        type = option["type"]
    if(type == "binary" and data["type"]== "enum"):
        if data["value"]=="low":
            return 0
        if data["value"]=="high":
            return 1
        if data["value"]=="togle" and oldValue == "0":
            return 1
        if data["value"]=="togle" and oldValue == "1":
            return 0
    if(type == "enum" and data["type"]== "enum"):
        return data["value"]
    if(type == "text"):
        return data["value"]
    if(type == "number" and data["type"]== "number"):
        return data["value"]
    if(type == "number" and data["type"]== "math"):
        v1 = int(getvalue(data["value1"],{"type":"number"}))
        v2 = int(getvalue(data["value2"],{"type":"number"}))
        if((not v1 and v1!=0) or (not v2 and v2!=0)):
            return None
        if(data["action"]=="+"):
            return v1+v2
        if(data["action"]=="-"):
            return v1-v2
        if(data["action"]=="*"):
            return v1*v2
        if(data["action"]=="/"):
            return v1//v2
    if(data["type"]== "device"):
        systemName = data["systemName"]
        device = devicesArrey.get(systemName)
        device = device["device"]
        values = device.values
        for item in values:
            if(item.name == data["action"]):
                val = item.get()
                return val

def actiondev(data):
    for item in data:
        if(item["type"]=="device"):
            systemName = item["systemName"]
            device = devicesArrey.get(systemName)
            device = device["device"]
            val = getvalue(item["value"],{"device":device,"field":item["action"]})
            setValue(device.systemName,item["action"],val)
        elif(item["type"]=="script"):
            templates = None
            fullName = item["systemName"] + ".yml"
            with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
                templates = yaml.safe_load(f)
            runscript(templates)
        elif(item["type"]=="delay"):
            print("p3",item.get("value").get("value"))
            time.sleep(int(item.get("value").get("value")))
            print("p4")
        else:
            print("oh")

def lockforScript(systemName,type):
    device = devicesArrey.get(systemName)
    device = device["device"]
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    # if type=="variable":
    #     type="value"
    for item in fileList:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,item)) as f:
            templates = yaml.safe_load(f)
        trig = templates["trigger"]
        for item2 in trig:
            if(templates["status"] and item2["type"]=="device" and item2["systemName"]==systemName and (item2["action"]=="all" or item2["action"]==type)):
                listscripts.append(templates["name"])
    return listscripts
