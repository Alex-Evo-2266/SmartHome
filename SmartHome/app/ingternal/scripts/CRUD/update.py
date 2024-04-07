from app.configuration.settings import SCRIPTS_DIR
from app.ingternal.file import readYMLFile, writeYMLFile
from app.ingternal.scripts.schemas.script_block import Script
from app.ingternal.scripts.exception.script_already_exists import ScriptAlreadyExists
from app.ingternal.scripts.serialization.script_block import dict_to_ScriptBlock

import os

async def updata_script(system_name: str, script: Script):
    try:
        readYMLFile(os.path.join(SCRIPTS_DIR, script.system_name + ".yml"))
        if script.system_name == system_name:
            script.blocks = [dict_to_ScriptBlock(x.dict()) for x in script.blocks]
            writeYMLFile(os.path.join(SCRIPTS_DIR, script.system_name + ".yml"), script.dict())
        else:
            raise ScriptAlreadyExists()
    except FileNotFoundError:
        script.blocks = [dict_to_ScriptBlock(x.dict()) for x in script.blocks]
        writeYMLFile(os.path.join(SCRIPTS_DIR, system_name + ".yml"), script.dict())
        os.rename(os.path.join(SCRIPTS_DIR, system_name + ".yml"), os.path.join(SCRIPTS_DIR, script.system_name + ".yml"))
