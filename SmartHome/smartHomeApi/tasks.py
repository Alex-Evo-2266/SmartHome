# from SmartHome.celery import app
# from .models import Device
# from .classes.devicesArrey import DevicesArrey
# from .logic.deviceControl.SmartHomeDevice import ControlDevices
# import json
#
# devicesArrey = DevicesArrey()
#
# def confdecod(data):
#     arr2 = []
#     for element in data:
#         arr2.append(element.receiveDict())
#     return arr2
#
# @app.task
# def get_data_from_device():
#     # print("test")
#     Devices = Device.objects.all()
#     arr = []
#     for item in Devices:
#         try:
#             # print("element",devicesArrey)
#             element = devicesArrey.get(item.id)
#             print("old",element)
#             if not element:
#                 dev = ControlDevices(item.receiveDict(),confdecod(item.configdevice_set.all()))
#                 print("dev",dev)
#                 if dev.get_device():
#                     devicesArrey.addDevice(item.id,dev)
#                     element = devicesArrey.get(item.id)
#                     item.DeviceControl = str(element["device"].get_control())
#                     item.save()
#             print(element)
#             element["device"].get_value()
#         except Exception as e:
#             print("error device",e)
#             el = devicesArrey.get(item.id)
#             if(el):
#                 devicesArrey.delete(item.id)
#     return 45
#
# @app.task
# def inspect():
#     print("inspect",devicesArrey.all())
