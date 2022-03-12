from SmartHome.settings import ROOMS
from SmartHome.schemas.room import RoomSchema
from SmartHome.logic.utils.file import readYMLFile, writeYMLFile

class Rooms(object):
    def all():
        rooms = readYMLFile(ROOMS)
        rs = list()
        if(rooms == None):
            return rs
        for item in rooms:
            rs.append(Device(**item))
        return devs


class Room(object):

    def __init__(self, *args, **kwargs):
        self.name = kwargs["name"]
        self.systemName: str
        self.devices: List[str]
        self.tempSensor: str
