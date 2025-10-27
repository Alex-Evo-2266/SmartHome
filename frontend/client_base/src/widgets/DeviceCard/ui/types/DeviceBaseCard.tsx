import { Card, RunningLine, ScreenSize, SizeContext, Typography } from "alex-evo-sh-ui-kit"
import { useCallback, useContext } from "react"
import { useNavigate } from 'react-router-dom';

import "./DeviceBaseCard.scss"
import { DeviceCardProps } from "../../models/props"
import { cardSizeStyle } from "../../models/sizeDeviceCard";
import { DeviceField } from "../fields"

const statusColor = {
    online: "#0f0",
	offline: "#f00",
	not_supported: "#ccc",
	unlink: "#ff0",
	unknown: "#ccc"
}

export const DeviceBaseCard: React.FC<DeviceCardProps> = ({ device }) => {

    const navigate = useNavigate()
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)

    const openDitail = useCallback(()=>{
        navigate(`/device/${device.system_name}`)
    },[device.system_name, navigate])

    return(
        <Card
        onClick={openDitail}
        header={device.name}
        className="device-card"
        style={cardSizeStyle(screen)}
        >
        <RunningLine type="small" text={`system name: ${device.system_name}`}/>
        <Typography type="title-2" className="device-card-system-name"></Typography>
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