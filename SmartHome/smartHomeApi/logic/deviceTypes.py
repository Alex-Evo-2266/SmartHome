from SmartHome.settings import DEVICETYPES
import yaml
import os, sys

def getDeviceTypes():
    try:
        templates = None
        with open(DEVICETYPES) as f:
            templates = yaml.safe_load(f)
        print(templates)
        return {
            "status": "ok",
            "data": templates
        }
    except Exception as e:
        print(e)
        return {
            "status": "error",
            "message": e
        }
