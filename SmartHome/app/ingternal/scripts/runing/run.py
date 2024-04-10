from app.ingternal.scripts.CRUD.read import get_scripts
from app.configuration.settings import SCRIPTS_DIR
from typing import List
from app.ingternal.scripts.schemas.script_block import ScriptBlock, ScriptBlockType
from app.ingternal.commands.pars.pars import pars
from app.ingternal.commands.pars.utils import TRUE_VALUE

import os

async def run_script(system_name:str):
	script = await get_scripts(os.path.join(SCRIPTS_DIR, system_name + ".yml"))
	if not script:
		return
	await run_blocks(script.blocks)

async def run_blocks(blocks:List[ScriptBlock]):
	print(blocks)
	for block in blocks:
		if block.type == ScriptBlockType.CONDITION:
			if await run_condition(block):
				await run_blocks([ScriptBlock(**x) for x in block.branch2])
			else:
				await run_blocks([ScriptBlock(**x) for x in block.branch1])
		elif block.type == ScriptBlockType.ACTION:
			await run_action(block)

async def run_condition(block:ScriptBlock):
	data = await pars(block.command)
	print("data1",data in TRUE_VALUE)
	return data in TRUE_VALUE

async def run_action(block:ScriptBlock):
	data = await pars(block.command)
	print(data)
