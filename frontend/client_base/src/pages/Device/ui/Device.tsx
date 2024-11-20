import { FAB, GridLayout, GridLayoutItem, Search } from "alex-evo-sh-ui-kit"
import { useAddDevice } from "../hooks/addDevice.hook"
import { DialogPortal } from "../../../shared"
import { AddDeviceDialog } from "../../../widgets/addDevice"

export const DevicePage = () => {

    const {addDeviceDialogVisible, showAddDeviceDialog, hideAddDeviceDialog} = useAddDevice()

    return(
        <div className="device-page">
            <Search onSearch={data=>console.log(data)}/>
            <GridLayout>
               
            </GridLayout>
            <FAB className="base-fab" onClick={showAddDeviceDialog}>+</FAB>
            {
                addDeviceDialogVisible &&
                <DialogPortal>
                    <AddDeviceDialog onHide={hideAddDeviceDialog}/>
                </DialogPortal>
            }
        </div>
    )
}