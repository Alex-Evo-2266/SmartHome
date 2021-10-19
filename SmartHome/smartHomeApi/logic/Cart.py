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

# from ..models import Device,HomePage,HomeCart,CartChildren,genId,getEmptyId
#
# def addHomePage(name,information="",id=None)->HomePage:
#     if(id):
#         page1 = HomePage.objects.filter(id=id)
#         if(page1):
#             return page1[0]
#         page = HomePage.objects.create(id=id,name=name,information=information)
#         return page
#     page = HomePage.objects.create(id=genId(HomePage.objects.all()),name=name,information=information)
#     return page
#
# def addCartChildren(name,type,typeAction,order,action,device,homeCart,width=1,height=1):
#     id=genId(CartChildren.objects.all())
#     element = CartChildren.objects.create(id=id,name=name,type=type,typeAction=typeAction,height=height,width=width,order=order,device=device,action=action,homeCart=homeCart)
#     element.save()
#     return element
#
# def addHomeCart(id_in_page,name,type,order,width,homePage):
#     cart = HomeCart.objects.create(id=genId(HomeCart.objects.all()),idInPage=id_in_page,name=name,type=type,order=order,homePage=homePage,width=width)
#     return cart
#
# def delete_old_cart(new,old):
#     list_delete = list()
#     for item in old:
#         b=True
#         for item2 in new:
#             if(item2["mainId"]==item.id):
#                 b=False
#                 break
#         if(b):
#             list_delete.append(item)
#     for item in list_delete:
#         item.delete()
#
# def updata_new_cart(new,old):
#     for item in new:
#         for item2 in old:
#             if(item["mainId"]==item2.id):
#                 item2.name=item["name"]
#                 item2.order=item["order"]
#                 item2.width=item["width"]
#                 item2.save()
#                 setElementCart(item["children"],item2)
#
# def add_new_cart(new,page):
#     for item in new:
#         if (not item["mainId"]):
#             cart = addHomeCart(item["id"],item["name"],item["type"],item["order"],item["width"],page)
#             setElementCart(item["children"],cart)
#
# def delete_old_cartElement(new,old):
#     list_delete = list()
#     for item in old:
#         b=True
#         for item2 in new:
#             if(item2["id"]==item.id):
#                 b=False
#                 break
#         if(b):
#             list_delete.append(item)
#     for item in list_delete:
#         item.delete()
#
# def updata_new_cartElement(new,old):
#     for item in new:
#         for item2 in old:
#             if(item["id"]==item2.id):
#                 item2.name=item["name"]
#                 item2.order=item["order"]
#                 item2.width=item["width"]
#                 item2.height=item["height"]
#                 item2.save()
#
# def add_new_cartElement(new,cart):
#     print(new)
#     for item in new:
#         if (not item["id"]):
#             device = None
#             if (("deviceId" in item) and item["deviceId"]):
#                 device = Device.objects.get(id=item["deviceId"])
#             addCartChildren(item["name"],item["type"],item["typeAction"],item["order"],item["action"],device,cart,item["width"],item["height"])
#
# def setElementCart(data,cart):
#     newelements = data
#     oldelement = cart.cartchildren_set.all()
#     delete_old_cartElement(newelements,oldelement)
#     oldelement = cart.cartchildren_set.all()
#     updata_new_cartElement(newelements,oldelement)
#     oldelement = cart.cartchildren_set.all()
#     add_new_cartElement(newelements,cart)
#
#
# def setPage(data):
#     try:
#         emptyIdCartElement = getEmptyId(CartChildren.objects.all())
#         pages = HomePage.objects.filter(id=data["id"])
#         page = None
#         if(not pages):
#             page = addHomePage(data["name"],"",data["id"]);
#         else:
#             page = pages[0]
#
#         # карточки
#         newcarts = data["carts"]
#         oldcart = page.homecart_set.all()
#         delete_old_cart(newcarts,oldcart)
#         oldcart = page.homecart_set.all()
#         updata_new_cart(newcarts,oldcart)
#         oldcart = page.homecart_set.all()
#         add_new_cart(newcarts,page)
#         return True
#     except Exception as e:
#         print("errerty",e)
#         return False
#
# def getPage(id)->dict:
#     try:
#         page = HomePage.objects.get(id=id)
#         pageDict = page.receiveDict()
#         carts = page.homecart_set.all()
#         cartsList = list()
#         for item in carts:
#
#             cart = item.receiveDict()
#             elements = item.cartchildren_set.all()
#             elementsList = list()
#             for item2 in elements:
#                 element = item2.receiveDict()
#                 elementsList.append(element)
#             cart["children"]=elementsList
#             cartsList.append(cart)
#         pageDict["carts"]=cartsList
#         return pageDict
#     except Exception as e:
#         return{
#             "carts":[]
#         }
