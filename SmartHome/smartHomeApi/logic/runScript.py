from .deviceSetValue import setValue
from ..models import Device
from SmartHome.settings import SCRIPTS_DIR
import os, sys


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
            device = Device.objects.get(id=idDev)
            values = device.valuedevice_set.all()
            for item in values:
                if(item.name == data["action"]):
                    if(data["value"]):
                        val = getvalue(data["value"])
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
    except:
        return False

def getvalue(data):
    if(data["type"]=="number"):
        try:
            return int(data["value"])
        except:
            return None
    elif(data["type"]=="text"):
        return data["value"]
    elif(data["type"]=="device"):
        IDdevice = data["idDevice"]
        device = Device.objects.get(id=IDdevice)
        values = device.valuedevice_set.all()
        for item in values:
            if(item.name == data["oper"]):
                val = item.value
                if(val=="on"):
                    val="1"
                elif(val=="off"):
                    val="0"
                return val
    elif(data["type"]=="math"):
        try:
            v1 = int(getvalue(data["value1"]))
            v2 = int(getvalue(data["value2"]))
            if(not v1 or not v2):
                return None
            if(data["oper"]=="+"):
                return v1+v2
            if(data["oper"]=="-"):
                return v1-v2
            if(data["oper"]=="*"):
                return v1*v2
            if(data["oper"]=="/"):
                return v1//v2
        except Exception as e:
            return None
    return None;

def actiondev(data):
    print("data",data)
    for item in data:
        IDdevice = item["DeviceId"]
        device = Device.objects.get(id=IDdevice)
        if(device):
            val = getvalue(item["value"])
            if(device.DeviceType=="variable" and item.action=="value"):
                setValue(device.id,"variable",val)
            else:
                print(val)
                setValue(device.id,item["action"],val)
        else:
            # scr = item.scriptAct
            # runscript(scr)
            print("oh")

def lockforScript(idDevice,type):
    device = Device.objects.get(id=idDevice)
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
