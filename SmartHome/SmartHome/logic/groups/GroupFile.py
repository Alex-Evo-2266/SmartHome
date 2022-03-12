from SmartHome.settings import GROUPS
from SmartHome.schemas.group import GroupSchema
from SmartHome.logic.utils.file import readYMLFile, writeYMLFile

class Groups(object):
    def all():
        groups = readYMLFile(GROUPS)
        gs = list()
        if(groups == None):
            return gs
        for item in groups:
            gs.append(Group(**item))
        return gs

    def get(systemName: str):
        groups = readYMLFile(GROUPS)
        if groups == None:
            groups = list()
        for item in groups:
            if(item["systemName"] == systemName):
                return Group(**item)
        return None

    def create(group: GroupSchema):
        groups = readYMLFile(GROUPS)
        if groups == None:
            groups = list()
        for item in groups:
            if(item["systemName"] == group.systemName):
                return None
        groupsel = Group(**group.dict())
        groupsel.save()
        return groupsel

class Group(GroupSchema):
    def editSysemName(self, newSystemName):
        groups = readYMLFile(GROUPS)
        for item in groups:
            if(item["systemName"] == self.systemName):
                item["systemName"] = newSystemName
        writeYMLFile(GROUPS, groups)

    def save(self):
        groups = readYMLFile(GROUPS)
        if groups == None:
            groups = list()
        flag = False
        for index, item in enumerate(groups):
            if(item["systemName"] == self.systemName):
                groups[index] = self.dict()
                flag = True
                break
        if(not flag):
            groups.append(self.dict())
        writeYMLFile(GROUPS, groups)

    def delete(self):
        groups = readYMLFile(GROUPS)
        group = None
        for item in groups:
            if(item["systemName"] == self.systemName):
                group = item
                break
        if(group):
            groups.remove(group)
        writeYMLFile(GROUPS, groups)

    def getDict(self):
        return self.dict()
