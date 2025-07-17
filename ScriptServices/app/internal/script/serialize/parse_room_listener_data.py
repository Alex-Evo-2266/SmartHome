
from app.internal.script.schemas.room import RoomData, RoomDeviceData

def parse_room_data(data: dict) -> RoomData:
    parsed_devices = {
        device_key: {
            field_key: [RoomDeviceData(**item) for item in field_list]
            for field_key, field_list in device_val.items()
        }
        for device_key, device_val in data['devices'].items()
    }
    return RoomData(
        room_name=data['room_name'],
        devices=parsed_devices
    )