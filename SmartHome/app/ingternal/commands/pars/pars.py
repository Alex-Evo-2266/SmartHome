
from typing import List

def pars(command:str):
    cov = False
    arg = False
    index = 0
    arr: List[List[str]] = [[],[]]
    buff = {"value": "", "arg":""}
    for char in command:
        print(char, " ")
        if char == '"':
            cov = not cov
        if not cov and char == "(" and buff["value"]:
            arg = True
        elif not cov and arg and char == ")":
            arg = False
        elif not cov and not arg and char == "=" and index == 0:
            arr[index].append(buff)
            buff = {"value": "", "arg":""}
            index = 1
            continue
        elif not cov and not arg and char == "=" and index > 0:
            raise Exception("invalid command")
        elif not cov and not arg and char == "+":
            arr[index].append(buff)
            buff = {"value": "", "arg":""}
            arr[index].append("+")
            continue
        elif arg:
            buff["arg"] += char
        else:
            buff["value"] += char
            continue
    if buff:
        arr[index].append(buff)
    print(arr)


print("command")
_command = input("command: ")
pars(_command)

