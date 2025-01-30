from app.ingternal.modules.arrays.modulesArray import ModulesArray

def f(data):
    print(data)

def getModule():
    ModulesArray.install_dependencies(__name__)
    ModulesArray.init_modules(__name__)
    ModulesArray.start()
    ModulesArray.for_each(f)


