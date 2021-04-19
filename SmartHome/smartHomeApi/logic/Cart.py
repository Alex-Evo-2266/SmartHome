from ..models import Device,HomePage,HomeCart,CartChildren,genId,getEmptyId

def addHomePage(name,information="",id=None)->HomePage:
    if(id):
        page1 = HomePage.objects.filter(id=id)
        if(page1):
            return page1[0]
        page = HomePage.objects.create(id=id,name=name,information=information)
        return page
    page = HomePage.objects.create(id=genId(HomePage.objects.all()),name=name,information=information)
    return page

def addCartChildren(name,type,typeAction,order,action,device,homeCart,width=1):
    # print(name,type,typeAction,order,action,device,homeCart)
    # print(ids)
    # if(len(ids)==1):
    #     ids.append(ids[0]+1)
    # id = ids.pop(0)
    id=genId(CartChildren.objects.all())
    element = CartChildren.objects.create(id=id,name=name,type=type,typeAction=typeAction,width=width,order=order,device=device,action=action,homeCart=homeCart)
    element.save()
    return element

def addHomeCart(id_in_page,name,type,order,width,homePage):
    cart = HomeCart.objects.create(id=genId(HomeCart.objects.all()),idInPage=id_in_page,name=name,type=type,order=order,homePage=homePage,width=width)
    return cart

def delete_old_cart(new,old):
    list_delete = list()
    for item in old:
        b=True
        for item2 in new:
            if(item2["mainId"]==item.id):
                b=False
                break
        if(b):
            list_delete.append(item)
    for item in list_delete:
        item.delete()

def updata_new_cart(new,old):
    for item in new:
        for item2 in old:
            if(item["mainId"]==item2.id):
                item2.name=item["name"]
                item2.order=item["order"]
                item2.width=item["width"]
                item2.save()
                setElementCart(item["children"],item2)

def add_new_cart(new,page):
    for item in new:
        if (not item["mainId"]):
            cart = addHomeCart(item["id"],item["name"],item["type"],item["order"],item["width"],page)
            setElementCart(item["children"],cart)

def delete_old_cartElement(new,old):
    list_delete = list()
    for item in old:
        b=True
        for item2 in new:
            if(item2["id"]==item.id):
                b=False
                break
        if(b):
            list_delete.append(item)
    for item in list_delete:
        item.delete()

def updata_new_cartElement(new,old):
    for item in new:
        for item2 in old:
            if(item["id"]==item2.id):
                item2.name=item["name"]
                item2.order=item["order"]
                item2.width=item["width"]
                item2.save()

def add_new_cartElement(new,cart):
    for item in new:
        if (not item["id"]):
            device = Device.objects.get(id=item["deviceId"])
            addCartChildren(item["name"],item["type"],item["typeAction"],item["order"],item["action"],device,cart,item["width"])

def setElementCart(data,cart):
    newelements = data
    oldelement = cart.cartchildren_set.all()
    delete_old_cartElement(newelements,oldelement)
    oldelement = cart.cartchildren_set.all()
    updata_new_cartElement(newelements,oldelement)
    oldelement = cart.cartchildren_set.all()
    add_new_cartElement(newelements,cart)


def setPage(data):
    try:
        emptyIdCartElement = getEmptyId(CartChildren.objects.all())
        pages = HomePage.objects.filter(id=data["id"])
        page = None
        if(not pages):
            page = addHomePage(data["name"],"",data["id"]);
        else:
            page = pages[0]

        # карточки
        newcarts = data["carts"]
        oldcart = page.homecart_set.all()
        delete_old_cart(newcarts,oldcart)
        oldcart = page.homecart_set.all()
        updata_new_cart(newcarts,oldcart)
        oldcart = page.homecart_set.all()
        add_new_cart(newcarts,page)
        return True
    except:
        return False




# def setPage(data):
#     carts = data["carts"]
#     oldcart = page.homecart_set.all()
#     for olditem in oldcart:
#         t = False
#         for item in carts:
#             if(olditem.id==item["mainId"]):
#                 t = True
#                 break
#         if(not t):
#             olditem.delete()
#
#
#
#     for item in carts:
#         cart = None
#         if(not item["mainId"]):
#             cart = addHomeCart(item["id"],item["name"],item["type"],item["order"],page)
#         else:
#             cart = HomeCart.objects.get(id=item["mainId"])
#             cart.name=item["name"]
#             cart.order=item["order"]
#             cart.save()
#         elements = item["children"]
#         for item2 in elements:
#             # print("newitem",item2)
#             oldelement = cart.cartchildren_set.all()
#             print(oldelement)
#             for olditem in oldelement:
#                 # print("olditem",olditem)
#                 t = False
#                 for item3 in elements:
#                     # print("k",item3)
#                     if(olditem.id==item3["id"]):
#                         t = True
#                         break
#                 if(not t):
#                     olditem.delete()
#             device = Device.objects.get(id=item2["deviceId"])
#             element = None
#             if(not item2["id"]):
#                 element = addCartChildren(emptyIdCartElement,item2["name"],item2["type"],item2["typeAction"],item2["order"],item2["action"],device,cart)
#             else:
#                 element = CartChildren.objects.get(id=item2["id"])
#                 element.name=item2["name"]
#                 element.order=item2["order"]
#                 element.save()
#
#     return True

def getPage(id)->dict:
    page = HomePage.objects.get(id=id)
    pageDict = page.receiveDict()
    carts = page.homecart_set.all()
    cartsList = list()
    for item in carts:

        cart = item.receiveDict()
        elements = item.cartchildren_set.all()
        elementsList = list()
        for item2 in elements:
            element = item2.receiveDict()
            elementsList.append(element)
        cart["children"]=elementsList
        cartsList.append(cart)
    pageDict["carts"]=cartsList
    return pageDict
