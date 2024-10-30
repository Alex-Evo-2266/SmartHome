import json

def json_read(filename: str):
    with open(filename) as f_in:
        return json.load(f_in)