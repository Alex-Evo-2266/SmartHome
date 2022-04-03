services = {}

def add(name, data):
    global services
    services[name] = data

def get(name):
    global services
    if not name in services:
        return None
    return services[name]
