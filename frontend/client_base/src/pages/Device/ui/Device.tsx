import { FAB, GridLayout, GridLayoutItem, Search } from "alex-evo-sh-ui-kit"
import { useAddDevice } from "../hooks/addDevice.hook"
import { DialogPortal } from "../../../shared"
import { AddDeviceDialog } from "../../../widgets/AddDevice"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const DevicePage = () => {

    const {addDeviceDialogVisible, showAddDeviceDialog, hideAddDeviceDialog} = useAddDevice()
    const {devicesData} = useAppSelector(state=>state.devices)

    return(
        <div className="device-page">
            <Search onSearch={data=>console.log(data)}/>
            <GridLayout>
            {
                devicesData.map((item, index)=>(
                    <GridLayoutItem key={index}>
                        <DeviceCard device={item}/>
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
        </div>
    )
}