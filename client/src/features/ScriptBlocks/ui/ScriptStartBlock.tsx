import { ArrowDownFromLine } from "lucide-react"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"

interface ScriptBlockActionProps{
    style?: React.CSSProperties
    className?: string
}

export const ScriptStartBlock = ({style, className}:ScriptBlockActionProps) => {

    return(
        <ScriptItem type="start" title="Start" icon={<ArrowDownFromLine/>} style={style} className={className}/>
    )
}