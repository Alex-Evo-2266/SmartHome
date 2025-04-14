import { DeviceDetailProps } from "../../models/props"


export const DetailDeviceUncnow:React.FC<DeviceDetailProps> = ({device}) => {

    return(
        <div>{device.name}</div>
    )
}