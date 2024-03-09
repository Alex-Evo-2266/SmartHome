import { GitFork } from "lucide-react"
import { ScriptBlock } from "../../../entites/Script"
import { ScriptItem } from "../../../entites/Script/ui/ScriptItem"
import './ScriptBlock.scss'

interface ScriptBlockConditionProps{
    data: ScriptBlock
    style?: React.CSSProperties
    className?: string
}

export const ScriptBlockCondition = ({data, style, className}:ScriptBlockConditionProps) => {

    return(
        <>
            <ScriptItem type="condition" title={data.command} icon={<GitFork style={{transform: "rotate(180deg)"}}/>} style={style} className={className}/>
            
        </>
    )
}
