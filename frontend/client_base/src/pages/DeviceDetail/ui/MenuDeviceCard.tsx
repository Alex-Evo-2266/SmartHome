import { BaseDialog, FAB, GearIcon, IMenuItem, IPoint, LinkIcon, Menu, Pen, ScreenSize, SizeContext, Trash, UnLinkIcon } from "alex-evo-sh-ui-kit"
import { useCallback, useContext, useMemo, useState } from "react"

import { MENU_ROOT_ID } from "../../../const"
import { StatusDevice } from "../../../entites/devices"
import { useDeleteDevice, useLinkDevice } from "../../../features/Device"
import { DialogPortal } from "../../../shared"


export const MenuDeviceCard = ({status, system_name, name, onEdit}:{status:StatusDevice, system_name:string, name:string, onEdit: ()=>void}) => {

    const {deleteDevice} = useDeleteDevice()
    const {linkDevice} = useLinkDevice()
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false)
    const {screen} = useContext<{screen: ScreenSize}>(SizeContext)
    const [poz, setPoz] = useState<IPoint | null>(null)

    const menuItems = useMemo<IMenuItem[]>(() => {
        return [
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
            ]
    },[onEdit, status, system_name, linkDevice])

    const click = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
        setPoz({x: Number(e.clientX), y: Number(e.clientY)})
    },[])

    return(
        <>
            <FAB icon={<GearIcon/>} onClick={click}/>
            <Menu autoHide marginBottom={screen === ScreenSize.MOBILE?80:0} onHide={()=>setPoz(null)} container={document.getElementById(MENU_ROOT_ID)} x={poz?.x ?? 0} y={poz?.y ?? 0} blocks={[{items:menuItems}]} visible={!!poz}/>
            {
                deleteDialogVisible && 
                <DialogPortal>
                    <BaseDialog header="delete device" text={`delete device ${name}?`} onHide={()=>setDeleteDialogVisible(false)} onSuccess={()=>deleteDevice(system_name)}/>
                </DialogPortal>
            }
        </>
    )
}