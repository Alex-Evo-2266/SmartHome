import { Plus } from "lucide-react"

interface ScriptAddBlockProps{
    index: number[]
    style?: React.CSSProperties
    className?: string
    onClick: (index: number[])=>void
}

export const ScriptAddBlock = ({index, style, className, onClick}:ScriptAddBlockProps) => {

    return(
        <div className={`add-script-block ${className}`} style={style} onClick={()=>onClick(index)}>
            <Plus/>
        </div>
    )
}