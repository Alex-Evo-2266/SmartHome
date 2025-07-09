
from typing import List
from app.internal.script.models.script import Script, ScriptNode, ScriptEdge  # замените на свои импорты
from app.internal.script.schemas.script import ScriptSerialize, ScriptNode as ScriptNodeSchema, ScriptEdge as ScriptEdgeSchema
from app.internal.script.schemas.enum import ScriptNodeType  # если тип — это Enum
import datetime

async def edit_status(id: str, status: bool):

    script: Script = await Script.objects.get_or_none(id=id)
    if not script:
        raise Exception()
    await script.update(updated_at=datetime.datetime.utcnow(), is_active=status)