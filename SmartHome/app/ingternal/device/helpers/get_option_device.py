from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.schemas.config import DeviceClassConfigSchema, ConfigSchema
import os
from app.configuration.settings import MODULES_URL

def get_config_devices():
    classes = DeviceClasses.all()
    options: list[DeviceClassConfigSchema] = []
    for class_name in classes:
        config = classes[class_name].device_config
        option = DeviceClassConfigSchema(**(config.model_dump()), class_name=class_name)
        if option.class_img:
            option.class_img = os.path.join(MODULES_URL, option.class_img) 
        options.append(option)
    return options