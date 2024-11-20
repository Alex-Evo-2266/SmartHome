import { FullScrinTemplateDialog } from "alex-evo-sh-ui-kit"
import { useOptionDevice } from "../api/getOptionalDevice"
import { useEffect } from "react"

type addDeviceDialogProps = {
    onHide: ()=>void
}

export const AddDeviceDialog:React.FC<addDeviceDialogProps> = ({onHide}) => {

    const {getOptionDevice} = useOptionDevice()

    useEffect(()=>{
        getOptionDevice()
    },[getOptionDevice])


    return(
        <FullScrinTemplateDialog onHide={onHide}>
            <div>

            </div>
        </FullScrinTemplateDialog>
    )
}