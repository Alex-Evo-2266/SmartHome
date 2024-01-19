import React from "react"
import "./FAB.scss"

interface ExtendedFABProps{
    icon?: React.ReactNode
    className?: string
    onClick?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    onContextMenu?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    children?: React.ReactNode
}



export const FAB = ({icon, className, onClick, onContextMenu, children}: ExtendedFABProps) => (
    <button className={`${className} extendedFAB`} onClick={onClick} onContextMenu={onContextMenu}>
        {icon}
        {
            (children)?
            <span>{children}</span>:
            null
        }
    </button>
)
