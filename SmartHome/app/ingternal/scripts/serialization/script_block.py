from typing import Any, List, Dict
from app.ingternal.scripts.schemas.script_block import ScriptBlock, ScriptBlockType

def dict_to_ScriptBlock(data: Dict)->ScriptBlock:
    branch1:List[ScriptBlock] = []
    branch2:List[ScriptBlock] = []
    if "branch1" in data:
        branch1 = [dict_to_ScriptBlock(x) for x in data["branch1"]]
    if "branch2" in data:
        branch2 = [dict_to_ScriptBlock(x) for x in data["branch2"]]
    return ScriptBlock(type=data["type"], command=data["command"], branch1=branch1, branch2=branch2)
