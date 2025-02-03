import { useState, useEffect, useCallback } from "react";
import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { Button, TextField, Typography } from "alex-evo-sh-ui-kit";
import "./device-field.scss"
import { useSendValue } from "../../api/sendValue";

export const DeviceTextField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {

  const [value, setValue] = useState(field.value);
  const {sendValue} = useSendValue()

  useEffect(() => {
    setValue(field.value);
  }, [field.value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  }

  const send = useCallback(()=>{
    sendValue(deviceName, field.id, String(value))
  },[value, deviceName, field])

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