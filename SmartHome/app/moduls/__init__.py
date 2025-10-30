from app.ingternal.modules.arrays.modulesArray import ModulesArray
import logging

logger = logging.getLogger(__name__)

def f(data):
    print(data)

async def getModule():
    try:
        ModulesArray.install_dependencies(__name__)
    except Exception as e:
        logger.error(f"Error install depends: {e}")
    try:
        ModulesArray.init_modules(__name__)
    except Exception as e:
        logger.error(f"Error init modules: {e}")
    await ModulesArray.start()
    ModulesArray.for_each(f)


