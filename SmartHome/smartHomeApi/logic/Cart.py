from ..models import Device,HomePage,HomeCart,CartChildren,genId

def addHomePage(name,information="",id=None)->HomePage:
    if(id):
        page1 = HomePage.objects.filter(id=id)
        if(page1):
            return page1[0]
        page = HomePage.objects.create(id=id,name=name,information=information)
        return page
    page = HomePage.objects.create(id=genId(HomePage.objects.all()),name=name,information=information)
    return page

def addHomeCart(id_in_page,name,type,order,homePage):
    cart = HomeCart.objects.create(id=genId(HomeCart.objects.all()),idInPage=id_in_page,name=name,type=type,order=order,homePage=homePage)
    return cart

def addCartChildren(name,type,typeAction,order,action,device,homeCart):
    print(homeCart)
    id=genId(CartChildren.objects.all())
    print(id)
    element = CartChildren.objects.create(id=id,name=name,type=type,typeAction=typeAction,order=order,device=device,action=action,homeCart=homeCart)
    return element

def setPage(data):
    pages = HomePage.objects.filter(id=data["id"])
    # print(pages)
    page = None
    if(not pages):
        page = addHomePage(data["name"],"",data["id"]);
    else:
        page = pages[0]
    # print(page,data["carts"])
    carts = data["carts"]
    oldcart = page.homecart_set.all()
    for olditem in oldcart:
        t = False
        for item in carts:
            if(olditem.id==item["mainId"]):
                t = True
                break
        if(not t):
            olditem.delete()



    for item in carts:
        # print(item)
        cart = None
        if(not item["mainId"]):
            cart = addHomeCart(item["id"],item["name"],item["type"],item["order"],page)
        else:
            cart = HomeCart.objects.get(id=item["mainId"])
            cart.name=item["name"]
            cart.order=item["order"]
            cart.save()
        elements = item["children"]
        # print(cart,elements)
        for item2 in elements:
            print(item2)
            device = Device.objects.get(id=item2["deviceId"])
            element = None
            print("r")
            if(not item2["id"]):
                print("o")
                element = addCartChildren(item2["name"],item2["type"],item2["typeAction"],item2["order"],item2["action"],device,cart)
                print("k")
            else:
                element = CartChildren.objects.get(id=item2["id"])
                print(element)
                element.name=item2["name"]
                element.order=item2["order"]
                element.save()

    return True

def getPage(id)->dict:
    page = HomePage.objects.get(id=id)
    # print(page.receiveDict())
    pageDict = page.receiveDict()
    carts = page.homecart_set.all()
    cartsList = list()
    for item in carts:

        # print(item.receiveDict())
        cart = item.receiveDict()
        elements = item.cartchildren_set.all()
        # print(elements)
        elementsList = list()
        for item2 in elements:
            element = item2.receiveDict()
            elementsList.append(element)
        cart["children"]=elementsList
        cartsList.append(cart)
    pageDict["carts"]=cartsList
    return pageDict
