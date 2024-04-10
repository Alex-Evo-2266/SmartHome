from app.ingternal.scripts.CRUD.read import get_scripts
from app.configuration.settings import SCRIPTS_DIR
from typing import List
from app.ingternal.scripts.schemas.script_block import ScriptBlock, ScriptBlockType
from app.ingternal.scripts.schemas.schema_runing import ScriptConditionBlock, ConditionType
from app.ingternal.scripts.serialization.serialization_command import serialization_condition_command
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

# def bracket(string: str):
#     data:List[List[str]] = []
#     buf:str = ""
#     flag = 0
#     for char in string:
#         print(char)
#         if(char == '(' and flag):
#             flag += 1
#             buf += char
#         elif(char == '(' and not flag):
#             data.append(buf.split("||"))
#             buf = ""
#             flag += 1
#         elif(char == ')'):
#             flag -= 1
#             if flag:
#                buf += char
#             else:
#                 data.append([buf])
#                 buf=""
#         else:
#             buf += char
#     data.append(buf.split("||"))
#     new_data = ScriptConditionBlock(type=ConditionType.OR, commands=[x for x in [x.strip() for x in sum(data, [])] if len(x)])

#     return new_data


# def bracket(string: str):
#     data:List[List[str]] = []
#     buf:str = ""
#     flag = 0
#     for idx, char in enumerate(string):
		
#     return data