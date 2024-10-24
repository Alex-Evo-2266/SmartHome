import yaml, os

def writeYMLFile(path, data):
    with open(path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)

def readYMLFile(path):
    if not os.path.exists(path):
         return
    templates = None
    with open(path) as f:
        templates = yaml.safe_load(f)
    return templates

def create_file(dir:str, file_name:str):
	if not os.path.exists(dir):
		os.mkdir(dir)
	return os.path.join(dir, f"{file_name}.yml")

