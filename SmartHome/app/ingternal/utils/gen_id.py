from uuid import uuid4

def create_id():
    return str(uuid4().hex)