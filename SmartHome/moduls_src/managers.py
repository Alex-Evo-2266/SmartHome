
menagers = {}

def add(name, data):
    global menagers
    menagers[name] = data

def get(name):
    global menagers
    if not name in menagers:
        return None
    return menagers[name]
