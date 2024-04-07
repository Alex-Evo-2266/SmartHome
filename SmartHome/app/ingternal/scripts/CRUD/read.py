from app.ingternal.file import readYMLFile
from app.configuration.settings import SCRIPTS_DIR
from app.ingternal.scripts.schemas.script_block import Script
from app.ingternal.scripts.serialization.script_block import dict_to_ScriptBlock
from typing import List

import os

async def get_scripts(path: str):
    try:
        data = readYMLFile(path)
        print(data)
        if "name" in data and "system_name" in data and "blocks" in data:
            return Script(name=data["name"], system_name=data["system_name"], blocks=[dict_to_ScriptBlock(x) for x in data["blocks"]])
        raise Exception()
    except Exception as e:
        pass

async def get_all_scripts():
    onlyfiles = [f for f in os.listdir(SCRIPTS_DIR) if os.path.isfile(os.path.join(SCRIPTS_DIR, f))]
    scripts:List[Script] = []
    for file_name in onlyfiles:
        data = await get_scripts(os.path.join(SCRIPTS_DIR, file_name))
        if data:
            scripts.append(data)
    return scripts