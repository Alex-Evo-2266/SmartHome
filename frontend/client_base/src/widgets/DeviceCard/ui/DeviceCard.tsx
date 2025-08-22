import { DeviceCardProps } from "../models/props"
import { LightDevice } from "./types/Light"
import { DeviceBaseCard } from "./types/DeviceBaseCard"
import { SwitchDevice } from "./types/Switch"
import { ClimateDevice } from "./types/Climate"


export const DeviceCard: React.FC<DeviceCardProps> = (props) => {

    const Cards:{[key:string]:React.FC<DeviceCardProps>} = {
        LIGHT: LightDevice,
        SWITCH: SwitchDevice,
        CLIMATE: ClimateDevice
    } as const

    const type = props.device.type_mask?.name_type
    const Card = type? Cards[type] ?? DeviceBaseCard: DeviceBaseCard

    return <Card {...props}/>
}