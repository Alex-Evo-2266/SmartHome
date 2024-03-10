import { ArrowDownFromLine } from "lucide-react"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"

interface ScriptBlockActionProps{
    style?: React.CSSProperties
    className?: string
    edit?: ()=>void
}

export const ScriptStartBlock = ({style, className, edit}:ScriptBlockActionProps) => {

    return(
        <ScriptItem edit={edit} type="start" title="Start" icon={<ArrowDownFromLine/>} style={style} className={className}/>
    )
}