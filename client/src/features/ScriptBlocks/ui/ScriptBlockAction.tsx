import { ArrowRight } from "lucide-react"
import { ScriptBlock } from "../../../entites/Script"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"

interface ScriptBlockActionProps{
    data: ScriptBlock
    style?: React.CSSProperties
    className?: string
}

export const ScriptBlockAction = ({data, style, className}:ScriptBlockActionProps) => {

    return(
        <ScriptItem type="action" title={data.command} icon={<ArrowRight/>} style={style} className={className}/>
    )
}