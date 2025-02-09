import { BaseDialog, Card, LinkIcon, MoreVertical, Pen, Trash, Typography, UnLinkIcon } from "alex-evo-sh-ui-kit"
import { DeviceSchema, StatusDevice } from "../../../entites/devices"
import { DeviceField } from "./fields"
import "./DeviceCard.scss"
import { useCallback, useState } from "react"
import { DialogPortal, IconButtonMenu } from "../../../shared"
import { useDeleteDevice } from "../api/deleteDevice"
import { useLinkDevice } from "../api/linkDevice"

const statusColor = {
    online: "#0f0",
	offline: "#f00",
	not_supported: "#ccc",
	unlink: "#ff0",
	unknown: "#ccc"
}

export const DeviceCard: React.FC<{ device: DeviceSchema, onEdit: ()=>void }> = ({ device, onEdit }) => {

    const {deleteDevice} = useDeleteDevice()
    const {linkDevice} = useLinkDevice()
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)

    const getMenu = useCallback(() => {
        return [{items:[
            {
                title: "edit",
                icon: <Pen/>,
                onClick: ()=>{
                    onEdit()
                }
            },
            {
                title: "lisk",
                icon: device.status === StatusDevice.UNLINK? <UnLinkIcon/>:<LinkIcon/>,
                activated: device.status !== StatusDevice.UNLINK,
                onClick: ()=>{
                    linkDevice(device.system_name, device.status === StatusDevice.UNLINK)
                }
            },
            {
                title: "delete",
                icon: <Trash primaryColor="#f00"/>,
                onClick: ()=>{
                    setDeleteDialogVisible(true)
                }
            }
            ]}]
    },[onEdit, device, linkDevice])

    return(
        <Card 
        header={device.name}
        className="device-card"
        iconButtonCell={<IconButtonMenu autoHide blocks={getMenu()} icon={<MoreVertical/>}/>}
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
        {
            deleteDialogVisible && 
            <DialogPortal>
                <BaseDialog header="delete device" text={`delete device ${device.name}?`} onHide={()=>setDeleteDialogVisible(false)} onSuccess={()=>deleteDevice(device.system_name)}/>
            </DialogPortal>
        }
        </Card>
    )
}