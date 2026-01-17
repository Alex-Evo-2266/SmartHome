import { DeviceSerializeFieldSchema, TypeDeviceField } from "@src/entites/devices";
import { Typography } from "alex-evo-sh-ui-kit";

import { DeviceEnumField } from "./enum";
import { DeviceNumberField } from "./number";
import { DeviceSwitchField } from "./switch";
import { DeviceTextField } from "./text";
import './device-field.scss'
import { useAppSelector } from "@src/shared/lib/hooks/redux";
import { useMemo } from "react";

export const DeviceField: React.FC<{ field: DeviceSerializeFieldSchema, deviceName:string}> = ({ field, deviceName }) => {

    const {devicesData} = useAppSelector(state=>state.devices)
      const valueData = useMemo(()=>{
          return !!field?.name? devicesData.find(i=>i.system_name === deviceName)?.value?.[field?.name]: undefined
      },[devicesData])

    const Components = {
        [TypeDeviceField.NUMBER]: DeviceNumberField,
        [TypeDeviceField.BASE]: DeviceTextField,
        [TypeDeviceField.BINARY]: DeviceSwitchField,
        [TypeDeviceField.COUNTER]: DeviceNumberField,
        [TypeDeviceField.ENUM]: DeviceEnumField,
        [TypeDeviceField.TEXT]: DeviceTextField
    }


    if(field.read_only)
        {
          return(
            <div className="device-field-container">
              <div className="device-field-input-container">
              <label className="device-field-label">{field.name}</label>
                <div className="device-field-input">
                  <Typography type="body">{valueData}</Typography>
                </div>
              </div>
            </div>
          )
        }

    const Component = Components[field.type]
    

    return <Component field={field} deviceName={deviceName}/>

};