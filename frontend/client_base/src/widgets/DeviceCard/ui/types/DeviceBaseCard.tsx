import { DeviceField } from "../fields"
import "./DeviceBaseCard.scss"
import { DeviceCardProps } from "../../models/props"
import { Card, Typography } from "alex-evo-sh-ui-kit"
import { useNavigate } from 'react-router-dom';
import { useCallback } from "react"

const statusColor = {
    online: "#0f0",
	offline: "#f00",
	not_supported: "#ccc",
	unlink: "#ff0",
	unknown: "#ccc"
}

export const DeviceBaseCard: React.FC<DeviceCardProps> = ({ device }) => {

    const navigate = useNavigate()

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name])

    return(
        <Card
        onClick={openDitail}
        header={device.name}
        className="device-card"
        >
        <Typography type="title-2" className="device-card-system-name">system name: {device.system_name}</Typography>
        <Typography type="body" className="block">class: <Typography type="body" className="device-card-class">{device.class_device}</Typography></Typography>
        <div className="device-card-status-container" >
            <div className="device-card-status" style={{color: "#fff", backgroundColor: statusColor[device.status]}}>{device.status}</div>
        </div>
        {
            (device.fields?.map((item, index)=>(
                <DeviceField deviceName={device.system_name} field={item} key={index}/>
            )))
        }
        
        </Card>
    )
}