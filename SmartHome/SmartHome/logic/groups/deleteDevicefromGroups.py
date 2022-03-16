from SmartHome.logic.groups.GroupFile import Groups

def dleteDevicesFromGroups(systemName:str):
    groups = Groups.all()
    for group in groups:
        group.devices= list(filter(lambda device: device.name != systemName, group.devices))
        group.save()
