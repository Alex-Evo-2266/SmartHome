import { ArrowRight } from "lucide-react"
import { ScriptBlock } from "../../../entites/Script"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"

interface ScriptBlockActionProps{
    data: ScriptBlock
    style?: React.CSSProperties
    className?: string
    edit?: ()=>void
}

export const ScriptBlockAction = ({data, style, className, edit}:ScriptBlockActionProps) => {

    return(
        <ScriptItem edit={edit} type="action" title={data.command} icon={<ArrowRight/>} style={style} className={className}>
        </ScriptItem>
    )
}