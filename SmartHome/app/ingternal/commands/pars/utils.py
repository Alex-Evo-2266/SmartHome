
FALSE_VALUE = ["0", "false", "False", "off", "Off", "OFF"]
TRUE_VALUE = ["1", "true", "True", "on", "On", "ON"]

def data_is_true(data:str):
    if data in TRUE_VALUE:
        return 1
    return data
    
def data_is_false(data:str):
    if data in FALSE_VALUE:
        return 0
    return data

def data_is_digint(data:str):
    if data.isdigit():
        return int(data)
    return data
    
def equally(data1:str, data2:str):
    if data_is_true(data1) == data_is_true(data2) or data_is_false(data1) == data_is_false(data2) or data_is_digint(data1) == data_is_digint(data2) or data1 == data2:
        return 1
    return 0

def more(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return int(data1) > int(data2)
    return data1 > data2

def more_or_equally(data1:str, data2:str):
    return more(data1, data2) or equally(data1, data2)

def less(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return int(data1) < int(data2)
    return data1 < data2

def less_or_equally(data1:str, data2:str):
    return less(data1, data2) or equally(data1, data2)

def summ(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return str(int(data1) + int(data2))
    return data1 + data2

def subtraction(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return str(int(data1) - int(data2))
    return data1 - data2

def multiplication(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return str(int(data1) * int(data2))
    return data1 * data2

def division(data1:str, data2:str):
    if data1.isdigit() and data2.isdigit():
        return str(int(data1) / int(data2))
    return data1 / data2