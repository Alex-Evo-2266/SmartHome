from app.configuration.settings import SCRIPTS_DIR
from app.ingternal.file import readYMLFile

import os

async def delete_script(system_name: str):
    readYMLFile(os.path.join(SCRIPTS_DIR, system_name + ".yml"))
    os.remove(os.path.join(SCRIPTS_DIR, system_name + ".yml"))