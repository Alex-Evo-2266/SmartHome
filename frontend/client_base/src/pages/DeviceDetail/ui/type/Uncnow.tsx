import { DeviceDetailProps } from "../../models/props"
import { MenuDeviceCard } from "../MenuDeviceCard"


export const DetailDeviceUncnow:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    return(
        <>
            <div>{device.name}</div>
            <MenuDeviceCard status={device.status} system_name={device.system_name} name={device.name} onEdit={onEdit}/>
        </>
    )
}