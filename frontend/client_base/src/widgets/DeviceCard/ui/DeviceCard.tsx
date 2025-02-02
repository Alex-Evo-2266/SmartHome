import { Card } from "alex-evo-sh-ui-kit"
import { DeviceSchema } from "../../../entites/devices"
import { DeviceField } from "./fields"
import "./DeviceCard.scss"

export const DeviceCard: React.FC<{ device: DeviceSchema }> = ({ device }) => {

    return(
        <Card header={device.name} subhead={device.class_device} text={device.status} className="device-card">
        {
            (device.fields?.map((item, index)=>(
                <DeviceField deviceName={device.system_name} field={item} key={index}/>
            )))
        }
        </Card>
    )
}