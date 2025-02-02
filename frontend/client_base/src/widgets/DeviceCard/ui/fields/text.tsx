import { useState, useEffect } from "react";
import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { TextField, Typography } from "alex-evo-sh-ui-kit";
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
    sendValue(deviceName, field.id, String(newValue))
  };

  return (
    <div className="device-field-container">
      <label className="device-field-label">{field.name}</label>
      <div className="device-field-input-container">
        <div className="device-field-input">
            <TextField value={value ?? ""} onChange={handleChange}/>
        </div>
        <Typography type="body" className="device-field-value">{value} {field.unit && <span className="device-field-unit">{field.unit}</span>}</Typography>
      </div>
    </div>
  );
};