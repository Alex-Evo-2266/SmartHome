import { Slider, Typography } from "alex-evo-sh-ui-kit";

import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import "./device-field.scss"
import { useGetNumberFieldControl } from "../../../../features/Device/hooks/fieldControl.hook";
import { useDebounce } from "../../../../shared";

export const DeviceNumberField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {
  
  const {changeField, fieldValue} = useGetNumberFieldControl(field, deviceName)

  const debouncedSend = useDebounce(changeField, 300)

  return (
    <div className="device-field-container">
      <label className="device-field-label">{field.name}</label>
      <div className="device-field-input-container">
        <div className="device-field-input">
            <Slider 
                max={field.high?Number(field.high): 100} 
                min={field.low?Number(field.low): 0} 
                onChange={debouncedSend} 
                value={fieldValue ?? undefined} 
            />
        </div>
        <Typography type="body" className="device-field-value">{fieldValue} {field.unit && <span className="device-field-unit">{field.unit}</span>}</Typography>
      </div>
    </div>
  );
};