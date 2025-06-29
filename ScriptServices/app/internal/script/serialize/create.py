import uuid
from typing import Dict
from app.internal.script.models.script import Script, ScriptNode, ScriptEdge
from app.internal.script.schemas.script import ScriptSerializeCreate
from datetime import datetime

async def save_script_to_db(script_data: ScriptSerializeCreate) -> Script:
    # 1. Создание самого сценария
    script = await Script.objects.create(
        name=script_data.name,
        description=script_data.description,
        is_active=script_data.is_active,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # 2. Словарь соответствия: client_id → real UUID
    node_id_map: Dict[str, uuid.UUID] = {}

    # 3. Сохраняем узлы
    for node_in in script_data.nods:
        real_id = uuid.uuid4()
        node_id_map[node_in.id] = real_id

        await ScriptNode.objects.create(
            id=real_id,
            script=script,
            type=node_in.type.value,
            expression=node_in.expression,
            description=node_in.description,
            x=node_in.x,
            y=node_in.y
        )

    # 4. Сохраняем связи
    for edge_in in script_data.edgs:
        source_id = node_id_map[edge_in.id_start]
        target_id = node_id_map[edge_in.id_end]

        source_node = await ScriptNode.objects.get(id=source_id)
        target_node = await ScriptNode.objects.get(id=target_id)

        await ScriptEdge.objects.create(
            script=script,
            source_node=source_node,
            target_node=target_node,
            condition_label=edge_in.condition_label,
        )

    return script
