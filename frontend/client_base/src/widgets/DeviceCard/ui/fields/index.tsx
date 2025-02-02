import { DeviceSerializeFieldSchema, TypeDeviceField } from "../../../../entites/devices";
import { DeviceNumberField } from "./number";
import { DeviceTextField } from "./text";


export const DeviceField: React.FC<{ field: DeviceSerializeFieldSchema, deviceName:string}> = ({ field, deviceName }) => {

    const Components = {
        [TypeDeviceField.NUMBER]: DeviceNumberField,
        [TypeDeviceField.BASE]: DeviceTextField,
        [TypeDeviceField.BINARY]: DeviceNumberField,
        [TypeDeviceField.COUNTER]: DeviceNumberField,
        [TypeDeviceField.ENUM]: DeviceTextField,
        [TypeDeviceField.TEXT]: DeviceTextField
    }

    const Component = Components[field.type]

    return <Component field={field} deviceName={deviceName}/>

};