import { Switch } from "alex-evo-sh-ui-kit";

import { DeviceSerializeFieldSchema } from "../../../../entites/devices";
import { useGetBinaryFieldControl } from "../../../../features/Device/hooks/fieldControl.hook";

export const DeviceSwitchField: React.FC<{ field: DeviceSerializeFieldSchema; deviceName: string }> = ({ field, deviceName }) => {

  const {changeField, fieldValue} = useGetBinaryFieldControl(field, deviceName)

  return (
    <div className="device-field-container">
      <div className="device-field-input-container">
      <label className="device-field-label">{field.name}</label>
        <div className="device-field-input">
            <Switch checked={fieldValue ?? false} onChange={changeField}/>
        </div>
      </div>
    </div>
  );
};