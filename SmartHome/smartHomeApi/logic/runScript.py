from .deviceSetValue import setValue
from ..models import Device
from SmartHome.settings import SCRIPTS_DIR
import os, sys
import yaml
from ..classes.devicesArrey import DevicesArrey

devicesArrey = DevicesArrey()


def runScripts(idDevice,type):
    scripts = lockforScript(idDevice,type)
    for item in scripts:
        templates = None
        fullName = item + ".yml"
        with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
            templates = yaml.safe_load(f)
        runscript(templates)

def runscript(data):
    if(ifgroup(data["if"])):
        print("ok")
        actiondev(data["then"])
    else:
        print("none")
        actiondev(data["else"])

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
            idDev = data["idDevice"]
            device = devicesArrey.get(idDev)
            device = device["device"]
            values = device.values
            for item in values:
                if(item.name == data["action"]):
                    if(data["value"]):
                        val = getvalue(data["value"],{"type":item.type})
                        rval = item.value
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
                oldValue = item.value
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
        IDdevice = data["idDevice"]
        device = devicesArrey.get(IDdevice)
        device = device["device"]
        values = device.values
        for item in values:
            if(item.name == data["action"]):
                val = item.value
                return val

def actiondev(data):
    for item in data:
        if(item["type"]=="device"):
            IDdevice = item["DeviceId"]
            device = devicesArrey.get(IDdevice)
            device = device["device"]
            val = getvalue(item["value"],{"device":device,"field":item["action"]})
            setValue(device.id,item["action"],val)
        elif(item["type"]=="script"):
            templates = None
            fullName = item["DeviceId"] + ".yml"
            with open(os.path.join(SCRIPTS_DIR,fullName)) as f:
                templates = yaml.safe_load(f)
            runscript(templates)
        else:
            print("oh")

def lockforScript(idDevice,type):
    device = devicesArrey.get(idDevice)
    device = device["device"]
    fileList = os.listdir(SCRIPTS_DIR)
    listscripts = list()
    if type=="variable":
        type="value"
    for item in fileList:
        templates = None
        with open(os.path.join(SCRIPTS_DIR,item)) as f:
            templates = yaml.safe_load(f)
        trig = templates["trigger"]
        for item2 in trig:
            if(templates["status"] and item2["type"]=="device" and item2["DeviceId"]==idDevice and (item2["action"]=="all" or item2["action"]==type)):
                listscripts.append(templates["name"])
    return listscripts
