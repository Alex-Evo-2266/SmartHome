import { DeviceCardProps } from "../models/props"
import { ClimateDevice } from "./types/Climate"
import { DeviceBaseCard } from "./types/DeviceBaseCard"
import { LightDevice } from "./types/Light"
import { MoveSensorDevice } from "./types/MoveSensor"
import { SwitchDevice } from "./types/Switch"


export const DeviceCard: React.FC<DeviceCardProps> = (props) => {

    const Cards:{[key:string]:React.FC<DeviceCardProps>} = {
        LIGHT: LightDevice,
        SWITCH: SwitchDevice,
        CLIMATE: ClimateDevice,
        MOTION: MoveSensorDevice,
        LIGHT_DECO: LightDevice
    } as const

    const type = props.device.type_mask?.name_type
    const Card = type? Cards[type] ?? DeviceBaseCard: DeviceBaseCard

    return <Card {...props}/>
}