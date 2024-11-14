from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.schemas.config import DeviceClassConfigSchema, ConfigSchema
def get_config_devices():
    classes = DeviceClasses.all()
    options: list[DeviceClassConfigSchema] = []
    for class_name in classes:
        config = classes[class_name].device_config
        options.append(DeviceClassConfigSchema(**(config.model_dump()), class_name=class_name))
    return options