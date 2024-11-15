from app.ingternal.modules.arrays.modulesArray import ModulesArray

def f(data):
    print(data)

def getModule():
    ModulesArray.initModules(__name__)
    ModulesArray.start()
    ModulesArray.forEtch(f)
