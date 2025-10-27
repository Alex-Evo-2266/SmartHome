import { DeviceSerializeFieldSchema } from "@src/entites/devices";
import { useSendValue } from "@src/entites/devices/api/sendValue";
import { Button, TextField } from "alex-evo-sh-ui-kit";
import { useState, useEffect, useCallback } from "react";

export const DeviceTextField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {

  const [value, setValue] = useState(field.value);
  const {sendValue} = useSendValue()

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const handleChange = (value: string) => {
    const newValue = value;
    setValue(newValue);
  }

  const send = useCallback(()=>{
    sendValue(deviceName, field.id, String(value))
  },[value, deviceName, field, sendValue])

  return (
    <div className="device-field-container device-text-container">
      <div className="device-field-input-container">
        <div className="device-field-input">
            <TextField placeholder={field.name} value={value ?? ""} onChange={handleChange}/>
        </div>
        <Button onClick={send}>send</Button>
      </div>
    </div>
  );
};