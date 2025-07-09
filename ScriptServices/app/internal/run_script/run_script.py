from app.internal.script.serialize.get import read
from app.internal.script.schemas.enum import ScriptNodeType
from app.internal.script.schemas.script import ScriptSerialize, ScriptNode
from app.internal.expression_parser.grammar import CommandAnaliz
from app.internal.expression_parser.evaluator import CalculateCall
from app.internal.expression_parser.context import get_context
import asyncio

async def run(id: str, target = None):
    script = await read(id)
    start_node = None
    if target == None:
        start_node = next((obj for obj in script.nods if obj.type == ScriptNodeType.START), None)
    if not start_node:
        return None
    await Node1(script, start_node)
    
async def Node1(script:ScriptSerialize, node: ScriptNode):
    path = "true"
    path = await NodeStart(node)

    edge = [obj for obj in script.edgs if obj.id_start == node.id and obj.condition_label == path]
    next_ids = {link.id_end for link in edge}
    next_node = [obj for obj in script.nods if obj.id in next_ids]
    tasks = [Node1(script, n) for n in next_node]
    await asyncio.gather(*tasks)

async def NodeStart(node: ScriptNode):
    print(node)
    if node.type == ScriptNodeType.START:
        return "true"
    elif node.type == ScriptNodeType.CONDITION:
        if await calculateNode(node):
            return "true"
        else:
            return "false"
    else:
        await calculateNode(node)
        return "true"
    
async def calculateNode(node: ScriptNode):
    parser = CommandAnaliz()
    parser.set_text(node.expression)
    result = parser.get_tree()
    res = CalculateCall.evaluate_call(result, get_context({}, {}))
    print(res, type(res))
    return res