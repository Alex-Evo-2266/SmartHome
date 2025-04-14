import { BaseDialog, LinkIcon, MoreVertical, Pen, Trash, UnLinkIcon } from "alex-evo-sh-ui-kit"
import { DialogPortal, IconButtonMenu } from "../../../shared"
import { useDeleteDevice } from "../api/deleteDevice"
import { useLinkDevice } from "../api/linkDevice"
import { useCallback, useState } from "react"
import { StatusDevice } from "../../../entites/devices"


export const MenuDeviceCard = ({status, system_name, name, onEdit}:{status:StatusDevice, system_name:string, name:string, onEdit: ()=>void}) => {

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
                icon: status === StatusDevice.UNLINK? <UnLinkIcon/>:<LinkIcon/>,
                activated: status !== StatusDevice.UNLINK,
                onClick: ()=>{
                    linkDevice(system_name, status === StatusDevice.UNLINK)
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
    },[onEdit, status, system_name, linkDevice])

    return(
        <>
            <IconButtonMenu transparent autoHide blocks={getMenu()} icon={<MoreVertical/>}/>
            {
                deleteDialogVisible && 
                <DialogPortal>
                    <BaseDialog header="delete device" text={`delete device ${name}?`} onHide={()=>setDeleteDialogVisible(false)} onSuccess={()=>deleteDevice(system_name)}/>
                </DialogPortal>
            }
        </>
    )
}