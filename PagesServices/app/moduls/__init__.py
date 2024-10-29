from app.internal.pages.logic.modulesArray import ModulesArray

def getModule():
    ModulesArray.initModules(__name__)
    ModulesArray.start()
