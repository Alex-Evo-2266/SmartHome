from app.db.models.device.device import Device

async def room_add_device(room_name: str, device_system_name: str):
    await Device.objects.filter(system_name=device_system_name).update(room=room_name)