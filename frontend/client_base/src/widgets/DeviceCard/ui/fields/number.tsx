import { useState, useEffect, useCallback } from "react";
import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { Slider, Typography } from "alex-evo-sh-ui-kit";
import "./device-field.scss"
import { useSendValue } from "../../api/sendValue";
import { useDebounce } from "../../../../shared";

export const DeviceNumberField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {
  const [value, setValue] = useState(Number(field.value));
  const {sendValue} = useSendValue()

  useEffect(() => {
    setValue((prev) => (prev !== Number(field.value) ? Number(field.value) : prev));
  }, [field.value, field.id]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    if (isNaN(newValue)) return;
    setValue(newValue);
    sendValue(deviceName, field.id, String(newValue))
  },[sendValue, deviceName, field.id])

  const debouncedSend = useDebounce(handleChange, 300)

  return (
    <div className="device-field-container">
      <label className="device-field-label">{field.name}</label>
      <div className="device-field-input-container">
        <div className="device-field-input">
            <Slider 
                max={field.high?Number(field.high): 100} 
                min={field.low?Number(field.low): 0} 
                onChange={debouncedSend} 
                value={value} 
            />
        </div>
        <Typography type="body" className="device-field-value">{value} {field.unit && <span className="device-field-unit">{field.unit}</span>}</Typography>
      </div>
    </div>
  );
};