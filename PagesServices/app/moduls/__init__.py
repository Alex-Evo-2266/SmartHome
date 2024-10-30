from app.internal.pages.logic.modulesArray import ModulesArray

def f(data):
    print(data.pages_path)
    print(data.dialogs_path)
    print(data.menu_path)

def getModule():
    ModulesArray.initModules(__name__)
    ModulesArray.start()
    ModulesArray.forEtch(f)
