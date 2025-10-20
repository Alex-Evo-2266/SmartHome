
from typing import List
from app.internal.script.models.script import Script, ScriptNode, ScriptEdge  # замените на свои импорты
from app.internal.script.schemas.script import ScriptSerialize, ScriptNode as ScriptNodeSchema, ScriptEdge as ScriptEdgeSchema, ScriptSerializeList
from app.internal.script.schemas.enum import ScriptNodeType  # если тип — это Enum

async def serialize_script(script: Script) -> ScriptSerialize:
    # Предзагрузим связанные сущности
    nodes: List[ScriptNode] = await script.nodes.all()
    edges: List[ScriptEdge] = await script.edges.select_related('source_node').select_related('target_node').all()

    # Сериализация узлов
    serialized_nodes = [
        ScriptNodeSchema(
            id=str(node.id),
            type=ScriptNodeType(node.type),
            expression=node.expression,
            description=node.description,
            x=node.x,
            y=node.y
        )
        for node in nodes
    ]

    # Сериализация рёбер
    serialized_edges = [
        ScriptEdgeSchema(
            id=str(edge.id),
            id_start=str(edge.source_node.id),
            id_end=str(edge.target_node.id),
            condition_label=str(edge.condition_label)
        )
        for edge in edges
    ]

    return ScriptSerialize(
        id=str(script.id),
        name=script.name,
        description=script.description,
        is_active=script.is_active,
        created_at=script.created_at,
        updated_at=script.updated_at,
        nods=serialized_nodes,
        edgs=serialized_edges
    )

async def read(id: str):
    script = await Script.objects.get_or_none(id=id)
    if script is None:
        raise Exception("script not found")
    data = await serialize_script(script)
    return data

async def read_all():
    scripts = await Script.objects.all()
    data = [await serialize_script(script) for script in scripts]
    return ScriptSerializeList(scripts=data)