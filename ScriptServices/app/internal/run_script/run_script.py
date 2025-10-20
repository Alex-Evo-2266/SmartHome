from app.internal.script.serialize.get import read
from app.internal.script.schemas.enum import ScriptNodeType
from app.internal.script.schemas.script import ScriptSerialize, ScriptNode
from app.internal.expression_parser.grammar import CommandAnaliz
from app.internal.expression_parser.evaluator import CalculateCall
from app.internal.run_script.context_build import get_context
from app.internal.device.array.serviceDataPoll import deviceDataPoll, roomDataPoll
from app.internal.logs import get_base_logger
import asyncio

logger = get_base_logger.get_logger(__name__)

async def run(id: str, target=None):
    logger.debug(f"[run] start script_id={id}, target={target}")
    script = await read(id)
    start_node = None
    if target is None:
        start_node = next((obj for obj in script.nods if obj.type == ScriptNodeType.START), None)
    if not start_node:
        logger.debug(f"[run] start_node not found in script {id}")
        return None
    logger.debug(f"[run] found start_node={start_node.id}")
    await Node1(script, start_node)
    logger.debug(f"[run] finish script_id={id}, target={target}")


async def Node1(script: ScriptSerialize, node: ScriptNode):
    logger.debug(f"[Node1] Executing node id={node.id}, type={node.type}")
    path = await NodeStart(node)
    logger.debug(f"[Node1] node id={node.id} returned path='{path}'")

    edge = [obj for obj in script.edgs if obj.id_start == node.id and obj.condition_label == path]
    next_ids = {link.id_end for link in edge}
    next_node = [obj for obj in script.nods if obj.id in next_ids]

    logger.debug(f"[Node1] Next nodes from node id={node.id}: {[n.id for n in next_node]}")
    tasks = [Node1(script, n) for n in next_node]
    await asyncio.gather(*tasks)

async def NodeStart(node: ScriptNode):
    if node.type == ScriptNodeType.START:
        logger.debug(f"[NodeStart] START node id={node.id}")
        return "true"
    elif node.type == ScriptNodeType.CONDITION:
        logger.debug(f"[NodeStart] CONDITION node id={node.id}")
        result = await calculateNode(node)
        logger.debug(f"[NodeStart] CONDITION node id={node.id} result={result}")
        return "true" if result else "false"
    else:
        logger.debug(f"[NodeStart] ACTION node id={node.id}")
        await calculateNode(node)
        return "true"

async def calculateNode(node: ScriptNode):
    try:
        logger.debug(f"[calculateNode] Evaluating node id={node.id}, expression='{node.expression}'")
        parser = CommandAnaliz()
        parser.set_text(node.expression)
        result = parser.get_tree()
        context = get_context(roomDataPoll.get_all_data(), deviceDataPoll.get_all())
        res = await CalculateCall.evaluate_call(result, context)
        logger.debug(f"[calculateNode] Result for node id={node.id}: {res}")
        return res
    except Exception as e:
        logger.error(f"[calculateNode] Error evaluating node id={node.id}: {e}")
        return None
