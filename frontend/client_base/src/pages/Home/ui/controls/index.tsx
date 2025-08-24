import { ControlElement } from "../../../../entites/dashboard"
import { BoolControl } from "./bool"
import { NumberControl } from "./number"

interface ControlsProps {
    data: ControlElement
}

export const Controls:React.FC<ControlsProps> = ({data}) => {

    if(data.type === "bool"){
        return <BoolControl data={data}/>
    }
    if(data.type === "number"){
        return <NumberControl data={data}/>
    }
    return null
}