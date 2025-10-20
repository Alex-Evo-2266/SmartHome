from app.ingternal.modules.arrays.modulesArray import ModulesArray

def f(data):
    print(data)

async def getModule():
    ModulesArray.install_dependencies(__name__)
    ModulesArray.init_modules(__name__)
    await ModulesArray.start()
    ModulesArray.for_each(f)


