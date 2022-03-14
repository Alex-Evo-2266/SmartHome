from SmartHome.logic.device.deviceSetValue import setValue
from SmartHome.logic.groups.setValueGroup import setValueGroup
from SmartHome.logic.groups.GroupFile import Groups
from SmartHome.schemas.device import DeviceValueSchema
from SmartHome.settings import SCRIPTS_DIR
import os, sys
import yaml, asyncio
import threading
import time
from datetime import datetime
from SmartHome.logic.device.devicesArrey import devicesArrey
import logging

logger = logging.getLogger(__name__)

hour = 0;
month = 13;

async def runTimeScript():
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
        logger.error(f"run script error. detail: {e}")


def runscript(data):
    def d():
        try:
            if(ifgroup(data["condition"])):
                print("ok")
                asyncio.run(actiondev(data["then"]))
            else:
                print("none")
                asyncio.run(actiondev(data["otherwise"]))
        except Exception as e:
            print("1",e)

    try:
        s = threading.Thread(target=d)
        s.daemon = True
        s.start()
    except Exception as e:
        print("2",e)


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
        logger.error(f"run script error. detail: {e}")
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
    if(("group" in option) and ("field" in option)):
        field = None
        for item in option["group"].fields:
            if(item.name==option["field"]):
                type = item.type
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

async def actiondev(data):
    for item in data:
        if(item["type"]=="device"):
            systemName = item["systemName"]
            device = devicesArrey.get(systemName)
            device = device["device"]
            val = getvalue(item["value"],{"device":device,"field":item["action"]})
            await setValue(device.systemName,item["action"],val)
        elif(item["type"]=="group"):
            systemName = item["systemName"]
            group = Groups.get(systemName)
            val = getvalue(item["value"],{"group":group,"field":item["action"]})
            await setValueGroup(DeviceValueSchema(systemName=group.systemName,type=item["action"],status=val))
        elif(item["type"]=="script"):
            templates = None
            fullName = item["systemName"] + ".yml"
            with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
                templates = yaml.safe_load(f)
            runscript(templates)
        elif(item["type"]=="delay"):
            time.sleep(int(item.get("value").get("value")))
        else:
            print("oh")

def lockforScript(systemName,type):
    if not systemName:
        return []
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
