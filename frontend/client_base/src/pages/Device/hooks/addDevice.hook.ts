import { useState } from "react"


export const useAddDevice = () => {

    const [addDeviceDialogVisible, setAddDeviceDialogVisible] = useState<boolean>(false)
    
    const showAddDeviceDialog = () => {
        setAddDeviceDialogVisible(true)
    }

    const hideAddDeviceDialog = () => {
        setAddDeviceDialogVisible(false)
    }

    return{
        showAddDeviceDialog,
        hideAddDeviceDialog,
        addDeviceDialogVisible
    }
}