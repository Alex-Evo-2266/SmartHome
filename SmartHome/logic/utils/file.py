import yaml
import os, sys

def writeYMLFile(path, data):
    with open(path, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)

def readYMLFile(path):
    templates = None
    with open(path) as f:
        templates = yaml.safe_load(f)
    return templates
