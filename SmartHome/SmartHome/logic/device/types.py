import yaml
import logging
import os, sys

from castom_moduls import getDevices

from SmartHome.schemas.device import TypesDeviceSchema
from moduls_src.models_schema import AddDevice, TypeValueDevice, ValidTypeDevice

logger = logging.getLogger(__name__)

def allTyps(typs):
    alltyps = [e.value for e in ValidTypeDevice]
    alltyps.remove("variable")
    for item in typs:
        if item == "all":
            return alltyps
    return typs

async def convertFormat():
    baseTyps = ["light","switch","wireless switchs","relay","socket","sensor"]
    devices = getDevices()
    types = list()

    for key in devices:
        devclass = devices[key]["class"]
        types.append(
            TypesDeviceSchema(
                title=key,
                typs=allTyps(devclass.typesDevice),
                config=devclass.add
                )
            )
    types.append(
        TypesDeviceSchema(
            title="variable",
            typs=["variable"],
            config=AddDevice(address="", token="", valueType=TypeValueDevice.TEXT)
            )
        )
    # for key in devices:
    #     for item in devices[key]["typeDevices"]:
    #         if(baseTyps.count(item) == 0 and item != "all"):
    #             baseTyps.append(item)
    # for item in baseTyps:
    #     types.append(
    #         TypesDeviceSchema(
    #             title=item,
    #             interface=[]
    #         )
    #     )
    # for item in types:
    #     for key in devices:
    #         for item2 in devices[key]["typeDevices"]:
    #             if(item.title == item2 or item2 == "all"):
    #                 item.interface.append(key)
    # types.append(
    #     TypesDeviceSchema(
    #         title="variable",
    #         interface=["variable"]
    #         )
    #     )
    return types

async def getDeviceTypes():
    try:
        templates = await convertFormat()
        logger.debug(f'typs devices: {templates}')
        return {
            "status": "ok",
            "data": templates
        }
    except Exception as e:
        logger.error(f'error get type. detail:{e}')
        return {
            "status": "error",
            "detail": str(e)
        }
