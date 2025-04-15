import { FAB, GridLayout, GridLayoutItem, Plus, Search } from "alex-evo-sh-ui-kit"
import { DialogPortal } from "../../../shared"
import { AddDeviceDialog } from "../../../widgets/AddDevice"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import "./DevicePage.scss"
import { useToggle } from "../hooks/addDevice.hook"
import { useMemo, useState } from "react"
import { DeviceEdit } from "../../../widgets/EditDevice"
import { DeviceSchema } from "../../../entites/devices"

export const DevicePage = () => {
    const {visible:addDeviceDialogVisible, show:showAddDeviceDialog, hide:hideAddDeviceDialog} = useToggle()
    const [editData, setEditData] = useState<DeviceSchema | null>(null)
    const {devicesData} = useAppSelector(state=>state.devices)
    const [searchQuery, setSearchQuery] = useState("")

    // Фильтрация и сортировка устройств по имени
    const filteredDevices = useMemo(()=>devicesData
    .filter(device => device.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name)),[devicesData, searchQuery]) 

    return(
        <div className="device-page container-page">
            <Search onSearch={data => setSearchQuery(data)}/>
            <GridLayout className="device-container" itemMaxWith="300px" itemMinWith="200px">
            {
                filteredDevices.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item} onEdit={()=>setEditData(item)}/>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB className="base-fab" onClick={showAddDeviceDialog} icon={<Plus/>}/>
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
