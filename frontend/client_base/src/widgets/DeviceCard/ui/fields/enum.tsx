import { useState, useEffect, useCallback } from "react";
import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { useSendValue } from "../../../../entites/devices/api/sendValue";
import { SelectField } from "../../../../shared";

export const DeviceEnumField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {

  const [value, setValue] = useState(field.value);
  const {sendValue} = useSendValue()

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const handleChange = useCallback((value:string) => {
    setValue(value)
    sendValue(deviceName, field.id, value);
  },[deviceName, field])

  return (
    <div className="device-field-container device-text-container">
      <div className="device-field-input-container">
        <SelectField placeholder={field.name} className="select-field-device-field" value={value ?? undefined} items={field.enum_values?.split(",").map(item=>item.trim()) ?? []} onChange={handleChange}/>
      </div>
    </div>
  );
};