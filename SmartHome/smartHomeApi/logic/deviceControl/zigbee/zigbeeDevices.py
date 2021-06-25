zigbeeDevices = []

def addzigbeeDevices(id,data):
    global zigbeeDevices
    dev = dict()
    a=True
    for item in zigbeeDevices:
        if(item["id"]==id):
            item["data"]=data
            a=False
    if(a):
        dev["id"] = id
        dev["data"] = data
        zigbeeDevices.append(dev)



def getzigbeeDevices():
    global zigbeeDevices
    return zigbeeDevices

def decodeZigbeeDevices(data):
    # print(data)
    for item in data:
        # print("1",item,"\n")
        d = item["definition"]
        dev = dict()
        dev["name"] = item["friendly_name"]
        dev["address"] = item["ieee_address"]
        dev["type"] = item["type"]
        if "power_source" in item:
            dev["power_source"] = item["power_source"]
        if(d and ("model" in d)):
            dev["model"] = d["model"]
            dev["vendor"] = d["vendor"]
            if("exposes" in d):
                dev["exposes"] = d["exposes"]
                # for item2 in d["exposes"]:
                    # print(dev["name"],item2,"\n")
        # print(dev,"\n")
        addzigbeeDevices(dev["address"],dev)
        # print(item["friendly_name"])
        # d = item["definition"]
