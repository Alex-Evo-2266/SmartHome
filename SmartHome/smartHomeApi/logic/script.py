from ..models import Scripts, Value,Triger,IfBlock,IfGroupBlock,Action,Device,genId

def addscript(data):
    try:
        print(data,"\n")
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
        return False


def addtriggers(data,script):
    print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            trigger = Triger.objects.create(id=genId(Triger.objects.all()),type=item["type"],action=item["action"],device=device,script=script)

def addifs(data,script):
    print(data,"\n")
    if(data["type"]=="group"):
        addifGroup(data,script)

def addifGroup(data,perent):
    print(data,"\n")
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
    print(data,"\n")
    block = IfBlock.objects.create(id=genId(IfBlock.objects.all()),type=data["type"],oper=data["oper"],action=data["action"],block=perent)
    if(data["type"]=="device"):
        device = Device.objects.get(id=data["idDevice"])
        block.device = device
        if(data["value"]):
            # addValue(data["value"])
            block.value = addValue(data["value"])
        block.save()

def addValue(data)->Value:
    print(data,"\n")
    value = Value.objects.create(id=genId(Value.objects.all()),type=data["type"])
    if(data["type"]=="number" or data["type"]=="text"):
        value.value = data["value"]
        value.save()
    if(data["type"]=="device"):
        device = Device.objects.get(id=data["idDevice"])
        value.device = device
        value.value = data["action"]
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
    print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="then",action=item["action"],device=device,script=script)
            if(item["value"]):
                act.value = addValue(item["value"])
                act.save()

def addelses(data,script):
    print(data,"\n")
    for item in data:
        if(item["type"]=="device"):
            device = Device.objects.get(id=item["DeviceId"])
            act = Action.objects.create(id=genId(Action.objects.all()),type="else",action=item["action"],device=device,script=script)
            if(item["value"]):
                act.value = addValue(item["value"])
                act.save()
