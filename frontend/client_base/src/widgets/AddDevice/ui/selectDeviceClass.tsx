import { FullScrinTemplateDialog, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { useGetOptionDevice } from "../api/getOptionalDevice"
import { DeviceClassOptions } from "../models/options"

type addDeviceDialogProps = {
    onHide: ()=>void
    onChange: (option: DeviceClassOptions)=>void
}

export const SelectDeviceDialog:React.FC<addDeviceDialogProps> = ({onHide, onChange}) => {

    const {options} = useGetOptionDevice()

    return(
        <FullScrinTemplateDialog header="Select class device" onHide={onHide}>
            <ListContainer transparent>
            {
                options && options.map((item, index)=>{
                    return(
                        <ListItem onClick={()=>onChange(item)} hovered icon={<img src={item.class_img} alt="device-icon"/>} header={item.class_name} key={`item-${index}`}></ListItem>
                    )
                })
            }
            </ListContainer>
        </FullScrinTemplateDialog>
    )
}