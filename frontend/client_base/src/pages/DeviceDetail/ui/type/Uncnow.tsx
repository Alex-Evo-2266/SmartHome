import { DeviceDetailProps } from "../../models/props"
import { DetailDeviceTemplate } from "./Temlate.DetailPage"
import { ContentBox } from "alex-evo-sh-ui-kit"
import { DeviceField } from "../../../../widgets/DeviceCard/ui/fields"

import './SwitchDetail.scss'

export const DetailDeviceUncnow:React.FC<DeviceDetailProps> = ({device, onEdit}) => {

    return(
        <DetailDeviceTemplate 
            device={device} 
            onEdit={onEdit} 
        >
            <div className={`main-control`}>
            </div>
            {
                device.fields && device.fields.length > 0 && 
                <ContentBox label="other" collapsible defaultVisible>
                    {
                        device.fields.map((item, index)=>(
                            <DeviceField deviceName={device.system_name} field={item} key={`${device.system_name}-field-${index}`}/>
                        ))
                    }
                </ContentBox>
            }
        </DetailDeviceTemplate>
    )
}

