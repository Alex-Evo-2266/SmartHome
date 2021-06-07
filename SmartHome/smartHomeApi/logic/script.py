from ..models import Scripts, Value,Triger,IfBlock,IfGroupBlock,Action,Device,genId,set_to_list_dict
from .runScript import runscript

def addscript(data):
    try:
        print("ertyuiop",data,"\n")
        status = False
        if(len(data["trigger"])>0):
            status = True
        script = Scripts.objects.create(id=genId(Scripts.objects.all()),name=data["name"],status=status)
        addtriggers(data["trigger"],script)
        addifs(data["if"],script)
        addthens(data["then"],script)
        addelses(data["else"],script)
        return True
    except Exception as e:
        print(e)
        return False


def addtriggers(data,script):
    # print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            trigger = Triger.objects.create(id=genId(Triger.objects.all()),type=item["type"],action=item["action"],device=device,script=script)

def addifs(data,script):
    # print(data,"\n")
    if(data["type"]=="group"):
        addifGroup(data,script)

def addifGroup(data,perent):
    # print(data,"\n")
    group = IfGroupBlock.objects.create(id=genId(IfGroupBlock.objects.all()),type=data["oper"])
    if(type(perent)==Scripts):
        group.script = perent
        group.save()
    elif(type(perent)==IfGroupBlock):
        group.block = perent
        group.save()
    else:
        return False
    for item in data["children"]:
        if(item["type"]=="group"):
            addifGroup(item,group)
        else:
            addIfBlock(item,group)

def addIfBlock(data,perent):
    # print(data,"\n")
    block = IfBlock.objects.create(id=genId(IfBlock.objects.all()),type=data["type"],oper=data["oper"],action=data["action"],block=perent)
    if(data["type"]=="device"):
        device = Device.objects.get(id=data["idDevice"])
        block.device = device
        if(data["value"]):
            # addValue(data["value"])
            addValue(data["value"],block)
        block.save()

def addValue(data,perent=None)->Value:
    # print(data,"\n")
    value = Value.objects.create(id=genId(Value.objects.all()),type=data["type"])
    if(type(perent)==IfBlock):
        value.ifBlock = perent
        value.save()
    if(type(perent)==Action):
        value.actBlock = perent
        value.save()
    if(data["type"]=="number" or data["type"]=="text"):
        value.value = data["value"]
        value.save()
    if(data["type"]=="device"):
        device = Device.objects.get(id=data["idDevice"])
        value.device = device
        value.oper = data["action"]
        value.save()
    if(data["type"]=="math"):
        value.oper = data["action"]
        if(data["value1"]):
            value.valuefirst = addValue(data["value1"])
        if(data["value2"]):
            value.valuesecond = addValue(data["value2"])
        value.save()
    return value

def addthens(data,script):
    # print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="then",action=item["action"],device=device,script=script)
            if(item["value"]):
                addValue(item["value"],act)
        if(item["type"]=="script"):
            scriptact = Scripts.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="then",action=item["action"],device=None,script=script,scriptAct=scriptact)

def addelses(data,script):
    # print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="else",action=item["action"],device=device,script=script)
            if(item["value"]):
                addValue(item["value"],act)
        if(item["type"]=="script"):
            scriptact = Scripts.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="else",action=item["action"],device=None,script=script,scriptAct=scriptact)

def scripts():
    allscripts = set_to_list_dict(Scripts.objects.all())
    # print(allscripts)
    return allscripts

def script(id):
    Script = Scripts.objects.get(id=id).model_to_dict()
    return Script

def delgroupel(data):
    try:
        print("1.1")
        groups = data.ifgroupblock_set.all()
        print("1.2")
        for item in groups:
            delgroupel(item)
        print("1.3")
        elements = data.ifblock_set.all()
        print("1.4")
        for item in elements:
            print(item.value)
            delvalue(item.value)
        print("1.5")
    except Exception as e:
        print(e)

def delvalue(data):
    # print(data)
    print("1.4.1",data)
    if(not data):
        return
    print("1.4.2")
    if(data.type=="math"):
        delvalue(data.valuefirst)
        delvalue(data.valuesecond)
    print("1.4.3")
    data.delete()
    print("1.4.4")


def actdel(acts):
    for item in acts:
        try:
            delvalue(item.value)
        except Exception as e:
            print(e)

def scriptDelete(id):
    try:
        print("0")
        script = Scripts.objects.get(id=id)
        print(script)
        delgroupel(script.ifgroupblock)
        print("1")
        actdel(script.action_set.all())
        print("2")
        script.delete()
        return True
    except:
        return False

def scriptsetstatus(id,status):
    try:
        script = Scripts.objects.get(id=id)
        script.status = status
        script.save()
        return True
    except:
        return False

def runScript(id):
    try:
        script = Scripts.objects.get(id=id)
        runscript(script)
        return True
    except:
        return False
