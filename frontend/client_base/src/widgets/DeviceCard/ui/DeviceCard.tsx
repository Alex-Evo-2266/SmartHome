import { Card, MoreVertical, Pen, Trash } from "alex-evo-sh-ui-kit"
import { DeviceSchema } from "../../../entites/devices"
import { DeviceField } from "./fields"
import "./DeviceCard.scss"
import { useCallback } from "react"
import { IconButtonMenu } from "../../../shared"
import { useDeleteDevice } from "../api/deleteDevice"

export const DeviceCard: React.FC<{ device: DeviceSchema, onEdit: ()=>void }> = ({ device, onEdit }) => {

    const {deleteDevice} = useDeleteDevice()

    const getMenu = useCallback(() => {
        return [{items:[
            {
                title: "edit",
                icon: <Pen/>,
                onClick: ()=>onEdit()
            },
            {
                title: "delete",
                icon: <Trash primaryColor="#f00"/>,
                onClick: ()=>deleteDevice(device.system_name)
            }
            ]}]
    },[onEdit, device])

    return(
        <Card 
        header={device.name} 
        subhead={device.class_device} 
        text={device.status} 
        className="device-card"
        iconButtonCell={<IconButtonMenu blocks={getMenu()} icon={<MoreVertical/>}/>}
        >
        {
            (device.fields?.map((item, index)=>(
                <DeviceField deviceName={device.system_name} field={item} key={index}/>
            )))
        }
        </Card>
    )
}