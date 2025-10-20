from typing import Dict
from app.internal.script.models.script import Script, ScriptNode, ScriptEdge
from app.internal.script.schemas.script import ScriptSerializeCreate
from datetime import datetime


async def delete_script_to_db(id: str) -> Script:
    # 1. Создание самого сценария
    script = await Script.objects.get_or_none(id=id)
    if not script:
        raise Exception("script not found")
    
    await ScriptEdge.objects.filter(script=script).delete()
    await ScriptNode.objects.filter(script=script).delete()

    await script.delete()
