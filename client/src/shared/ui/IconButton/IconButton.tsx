import React from "react"
import "./IconButton.scss"

interface IconButtonProps{
    icon: React.ReactNode
    className?: string
    onClick?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    onContextMenu?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    disabled?: boolean
  }

export const IconButton = ({icon, className, onClick, onContextMenu, disabled}: IconButtonProps) => (
    <button className={`iconbutton`} onClick={onClick} onContextMenu={onContextMenu} disabled={disabled}>
        <div className={`${className} iconbutton-container`}>
            {icon}
        </div>
    </button>
)
