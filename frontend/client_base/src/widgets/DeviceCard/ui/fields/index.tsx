import { Typography } from "alex-evo-sh-ui-kit";
import { DeviceSerializeFieldSchema, TypeDeviceField } from "../../../../entites/devices";
import { DeviceNumberField } from "./number";
import { DeviceSwitchField } from "./switch";
import { DeviceTextField } from "./text";
import './device-field.scss'


export const DeviceField: React.FC<{ field: DeviceSerializeFieldSchema, deviceName:string}> = ({ field, deviceName }) => {

    const Components = {
        [TypeDeviceField.NUMBER]: DeviceNumberField,
        [TypeDeviceField.BASE]: DeviceTextField,
        [TypeDeviceField.BINARY]: DeviceSwitchField,
        [TypeDeviceField.COUNTER]: DeviceNumberField,
        [TypeDeviceField.ENUM]: DeviceTextField,
        [TypeDeviceField.TEXT]: DeviceTextField
    }


    if(field.read_only)
        {
          return(
            <div className="device-field-container">
              <div className="device-field-input-container">
              <label className="device-field-label">{field.name}</label>
                <div className="device-field-input">
                  <Typography type="body">{field.value}</Typography>
                </div>
              </div>
            </div>
          )
        }

    const Component = Components[field.type]
    

    return <Component field={field} deviceName={deviceName}/>

};