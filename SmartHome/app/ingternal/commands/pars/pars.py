
from typing import List
from app.ingternal.commands.schemas.commands import CommandSchema
from app.ingternal.commands.device_command.device_command import device_command, set_device_value
from app.ingternal.commands.pars.utils import equally, subtraction, summ, multiplication, division, more, more_or_equally, less, less_or_equally, TRUE_VALUE, FALSE_VALUE

import logging

logger = logging.getLogger(__name__)

def split_command(command: str, sep: str):
    strs:List[str] = []
    buff = ""
    flag = 0
    for char in command:
        if char == "(":
            flag += 1
        elif char == ")":
            flag -= 1
        if char == sep and not flag and buff != "":
            strs.append(buff)
            buff = ""
        else:
            buff += char
    if buff != "":
        strs.append(buff)
    return strs

async def command_data(command_element:List[str] | None):
    if len(command_element) == 0:
        return None
    if (len(command_element) >= 2 and command_element[0] == "device"):
        return await device_command(command_element[1:])
    if (len(command_element) == 1):
        return command_element[0]

async def command_pars(command:CommandSchema | None):
    print(command)
    if not command:
        return None
    command_element = split_command(command.command, ".")
    print("command_element: ", command_element)
    if (len(command.arg) == 0):
        return await command_data(command_element)
    if (len(command_element) >= 2 and command_element[0] == "device" and len(command.arg) == 2 and command.arg[0] == "="):
        return await set_device_value(command_element[1:], await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "==":
        return equally(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == ">":
        return more(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == ">=":
        return more_or_equally(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "<":
        return less(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "<=":
        return less_or_equally(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "+":
        return summ(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "-":
        return subtraction(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "*":
        return multiplication(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    if command.arg[0] == "/":
        return division(await command_data(command_element), await command_pars(CommandSchema(command=command.arg[1], arg=command.arg[2:])))
    
def and_or_or(data1, data2, flag):
    print("df ", data1, data2, flag)
    if data1 in TRUE_VALUE:
        data1 = True
    elif data1 in FALSE_VALUE:
        data1 = False
    if data2 in TRUE_VALUE:
        data2 = True
    elif data2 in FALSE_VALUE:
        data2 = False
    print("df2 ", type(data1), type(data2), flag)
    print("df3 ", bool(data1) and bool(data2), bool(data1) or bool(data2))
    if flag == "&&":
        return bool(data1) and bool(data2)
    elif flag == "||":
        return bool(data1) or bool(data2)

async def pars(commands: str):
    print("command pars func", commands)
    commands = commands.replace("\xa0", " ")
    commands_arr = [x.strip() for x in split_command(commands, " ")]
    command:CommandSchema | None = None
    flag = [None, None]
    res = [None, None]
    for item in commands_arr:
        print("item ", item, item[-1], item.strip("()"))
        if (item[0] == "(" and item[-1] == ")"):
            item = await pars(item.strip("()"))
            print("p90", item)
        if item == "&&" or item == "||":
            res[1] = await command_pars(command)
            command = None
            flag[1] = item
        elif not command:
            command = CommandSchema(command=item)
        else:
            command.arg.append(item)
        print(flag, res)
        if flag[0] != None and res[0] != None and res[1] != None:
            res[0] = and_or_or(res[0], res[1], flag[0])
            res[1] = None
            flag[0] = None
        if flag[0] == None:
            flag[0] = flag[1]
            flag[1] = None
        if res[0] == None:
            res[0] = res[1]
            res[1] = None
        print(flag, res)
    res[1] = await command_pars(command)
    if flag[0] != None and res[0] != None and res[1] != None:
        res[0] = and_or_or(res[0], res[1], flag[0])
        res[1] = None
        flag[0] = None
    else:
        res[0] = res[1]
    print(res, flag)
    return str(res[0])


