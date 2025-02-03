import { FAB, GridLayout, GridLayoutItem, Search } from "alex-evo-sh-ui-kit"
import { DialogPortal } from "../../../shared"
import { AddDeviceDialog } from "../../../widgets/AddDevice"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import "./DevicePage.scss"
import { useToggle } from "../hooks/addDevice.hook"
import { useState } from "react"
import { DeviceEdit } from "../../../widgets/EditDevice"
import { DeviceSchema } from "../../../entites/devices"

export const DevicePage = () => {

    const {visible:addDeviceDialogVisible, show:showAddDeviceDialog, hide:hideAddDeviceDialog} = useToggle()
    const [editData, setEditData] = useState<DeviceSchema | null>(null)
    const {devicesData} = useAppSelector(state=>state.devices)

    return(
        <div className="device-page">
            <Search onSearch={data=>console.log(data)}/>
            <GridLayout className="device-container">
            {
                devicesData.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item} onEdit={()=>setEditData(item)}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB className="base-fab" onClick={showAddDeviceDialog}>
                <span>+</span>
            </FAB>
            {
                addDeviceDialogVisible &&
                <DialogPortal>
                    <AddDeviceDialog onHide={hideAddDeviceDialog}/>
                </DialogPortal>
            }
            {
                editData &&
                <DialogPortal>
                    <DeviceEdit onHide={()=>setEditData(null)} data={editData}/>
                </DialogPortal>
            }
        </div>
    )
}