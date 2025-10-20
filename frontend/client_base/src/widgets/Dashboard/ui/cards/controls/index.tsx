import { ControlElement } from "../../../../../entites/dashboard"
import { BoolControl } from "./bool"
import { ButtonControl } from "./button"
import { NumberControl } from "./number"
import { ReadOnlyControl } from "./readonly"

interface ControlsProps {
    data: ControlElement
}

export const Controls:React.FC<ControlsProps> = ({data}) => {

    if(data.readonly)
        return <ReadOnlyControl data={data}/>

    if(data.type === "bool"){
        return <BoolControl data={data}/>
    }
    if(data.type === "number"){
        return <NumberControl data={data}/>
    }
    if(data.type === "button"){
        return <ButtonControl data={data}/>
    }
    return null
}