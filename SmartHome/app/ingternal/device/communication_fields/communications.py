from typing import Dict, List
from app.ingternal.device.models.device import Device_field
from app.ingternal.device.schemas.communication_fields import RelatedFields, TypeRelatedFields

import logging

logger = logging.getLogger(__name__)

class CommunicationFields():

    communications: Dict[str, List[RelatedFields]] = {}
    feedback: Dict[str, Dict[str, List[RelatedFields]]] = {}

    @classmethod
    def add_feedback(cls, from_system_name, from_field, to_system_name, to_field):
        feedback_device = cls.feedback[TypeRelatedFields.DEVICE]
        if not f"{from_system_name}.{from_field}" in feedback_device:
            feedback_device[f"{from_system_name}.{from_field}"] = []
        feedback_device[f"{from_system_name}.{from_field}"].append(RelatedFields(
                            type=TypeRelatedFields.DEVICE,
                            system_name=to_system_name,
                            field=to_field
                        ))
        cls.feedback[TypeRelatedFields.DEVICE] = feedback_device

    @classmethod
    async def load_communications(cls):
        cls.communications = {}
        cls.feedback[TypeRelatedFields.DEVICE] = {}
        device_fields:List[Device_field] = await Device_field.objects.all()
        for field in device_fields:
            if field.entity:
                related_fields = [s.strip() for s in field.entity.split(',')]
                arr:List[RelatedFields] = []
                for related_field in related_fields:
                    data = related_field.split(".")
                    if len(data) == 2:
                        arr.append(RelatedFields(
                            type=TypeRelatedFields.DEVICE,
                            system_name=data[0],
                            field=data[1]
                        ))
                        cls.add_feedback(data[0], data[1], field.device.system_name, field.name)
                    elif len(data) == 3:
                        arr.append(RelatedFields(
                            type=data[0],
                            system_name=data[1],
                            field=data[2]
                        ))
                        if data[0] == TypeRelatedFields.DEVICE:
                            cls.add_feedback(data[1], data[2], field.device.system_name, field.name)

                cls.communications[f"{field.device.system_name}.{field.name}"] = arr
        logger.debug(f"load communication fields: {cls.communications}")
        print(cls.feedback)

    @classmethod
    def get_related_fields_device(cls, system_name:str, field: str)->List[RelatedFields] | None:
        key = f"{system_name}.{field}"
        if key in cls.communications:
            return cls.communications[key]
        return None
    
    @classmethod
    def get_feedback_fields_device(cls, system_name:str, field: str)->List[RelatedFields] | None:
        key = f"{system_name}.{field}"
        if key in cls.feedback[TypeRelatedFields.DEVICE]:
            return cls.feedback[TypeRelatedFields.DEVICE][key]
        return None
