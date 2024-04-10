
from typing import List
from app.ingternal.scripts.schemas.schema_runing import ScriptCommandBlock

def split_command(command: str):
    strs:List[str] = []
    buff = ""
    flag = 0
    for char in command:
        if char == "(":
            flag += 1
        elif char == ")":
            flag -= 1
        if char == " " and not flag:
            strs.append(buff)
            buff = ""
        else:
            buff += char
    if buff != "":
        strs.append(buff)
    return strs

def rindex(list:List[str], separ:str):
    if not separ in list:
        return None
    return len(list) - 1 - next(i for i,x in enumerate(reversed(list)) if x == separ)

def serialization_or_command(command: str):
    strs = split_command(command)
    index = rindex(strs, "||")
    if not index:
        return None
    return ScriptCommandBlock(command=strs[index], arg=[" ".join(strs[0:index]), " ".join(strs[index + 1:])])

def serialization_and_command(command: str):
    strs = split_command(command)
    index = rindex(strs, "&&")
    if not index:
        return None
    return ScriptCommandBlock(command=strs[index], arg=[" ".join(strs[0:index]), " ".join(strs[index + 1:])])

def serialization_condition_command(command: str):
    print("p0",command)
    command = command.replace("\xa0", " ")
    data = serialization_or_command(command)
    if not data:
        data = serialization_and_command(command)
    if not data and command[0] == "(" and command[-1] == ")":
        return serialization_condition_command(command.strip("()"))
    if not data:
        strs = command.strip().split(" ")
        return ScriptCommandBlock(command=strs[0], arg=strs[1:])
    print(data)
    for arg in data.arg:
        data1 = serialization_condition_command(arg)
        print(data1)
    return 