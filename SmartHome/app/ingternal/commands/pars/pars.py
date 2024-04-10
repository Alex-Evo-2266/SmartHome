
from typing import List
from app.ingternal.commands.schemas.commands import CommandSchema
from app.ingternal.commands.device_command.device_command import device_command, set_device_value
from app.ingternal.commands.pars.utils import equally, subtraction, summ, multiplication, division, more, more_or_equally, less, less_or_equally

def split_command(command: str, sep: str):
    strs:List[str] = []
    buff = ""
    flag = 0
    for char in command:
        if char == "(":
            flag += 1
        elif char == ")":
            flag -= 1
        if char == sep and not flag:
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
    print("command_element: ", command_element)
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

async def pars(commands: str):
    commands = commands.replace("\xa0", " ")
    commands_arr = [x.strip() for x in split_command(commands, " ")]
    command:CommandSchema | None = None
    flag = 0
    res = None
    for item in commands_arr:
        if item == "&&":
            res = await command_pars(command)
            command = None
        elif item == "||":
            res = await command_pars(command)
            command = None
        elif not command:
            command = CommandSchema(command=item)
        else:
            command.arg.append(item)
    res = await command_pars(command)
    print(res)
    return str(res)


