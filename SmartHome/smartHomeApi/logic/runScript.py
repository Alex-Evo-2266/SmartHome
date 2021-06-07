from ..models import Scripts, Value,Triger,IfBlock,IfGroupBlock,Action,Device,genId,set_to_list_dict
from .deviceSetValue import setValue

def runScripts(idDevice,type):
    scripts = lockforScript(idDevice,type)
    for item in scripts:
        runscript(item)

def runscript(data):
    if(ifgroup(data.ifgroupblock)):
        print("ok")
        actiondev(data.action_set.filter(type="then"))
    else:
        print("none")
        actiondev(data.action_set.filter(type="else"))

def ifgroup(data):
    retArrey = list()
    blocks = data.ifgroupblock_set.all()
    elements = data.ifblock_set.all()
    for item in blocks:
        retArrey.append(ifgroup(item))
    for item in elements:
        retArrey.append(ifblock(item))
    if(data.type=="and"):
        for item in retArrey:
            if not item:
                return False
        return True
    elif(data.type=="or"):
        for item in retArrey:
            if item:
                return True
        return False
    else:
        return False

def ifblock(data):
    # print(data.model_to_dict())
    try:
        if(data.type=="device"):
            device = data.device
            values = device.valuedevice_set.all()
            for item in values:
                if(item.type == data.action):
                    if(data.value):
                        val = getvalue(data.value)
                        rval = item.value
                        if(rval=="on"):
                            rval="1"
                        elif(rval=="off"):
                            rval="0"
                        if(data.oper==">"):
                            val = int(val)
                            realval = int(rval)
                            return realval > val
                        if(data.oper==">="):
                            val = int(val)
                            realval = int(rval)
                            return realval >= val
                        if(data.oper=="<"):
                            val = int(val)
                            realval = int(rval)
                            return realval < val
                        if(data.oper=="<="):
                            val = int(val)
                            realval = int(rval)
                            return realval <= val
                        if(data.oper=="=="):
                            return str(rval) == str(val)
                        if(data.oper=="!="):
                            return str(rval) != str(val)
                    else:
                        return False
        return False
    except:
        return False

def getvalue(data):
    if(data.type=="number"):
        try:
            return int(data.value)
        except:
            return None
    elif(data.type=="text"):
        return data.value
    elif(data.type=="device"):
        # print(data.device)
        device = data.device
        values = device.valuedevice_set.all()
        for item in values:
            if(item.type == data.oper):
                val = item.value
                if(val=="on"):
                    val="1"
                elif(val=="off"):
                    val="0"
                return val
    elif(data.type=="math"):
        try:
            v1 = int(getvalue(data.valuefirst))
            v2 = int(getvalue(data.valuesecond))
            if(not v1 or not v2):
                return None
            if(data.oper=="+"):
                return v1+v2
            if(data.oper=="-"):
                return v1-v2
            if(data.oper=="*"):
                return v1*v2
            if(data.oper=="/"):
                return v1//v2
        except Exception as e:
            return None
    return None;

def actiondev(data):
    print("data",data)
    for item in data:
        device = item.device
        if(device):
            val = getvalue(item.value)
            if(device.DeviceType=="variable" and item.action=="value"):
                setValue(device.id,"variable",val)
            else:
                setValue(device.id,item.action,val)
        else:
            scr = item.scriptAct
            runscript(scr)

def lockforScript(idDevice,type):
    device = Device.objects.get(id=idDevice)
    triggers = device.triger_set.all()
    scripts = list()
    for item in triggers:
        if type=="variable":
            type="value"
        if(item.action=="all" or item.action==type):
            if(item.script.status):
                scripts.append(item.script)
    return scripts
