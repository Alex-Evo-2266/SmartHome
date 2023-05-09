import React from "react"
import "./IconButton.scss"

interface IconButtonProps{
    icon: React.ReactNode
    className?: string
    onClick?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    onContextMenu?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    disabled?: boolean
  }

export const IconButton = ({icon, className, onClick, onContextMenu, disabled}: IconButtonProps) => {

    const click = (e:React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e)
        let overlay = document.createElement('span')
        overlay.classList.add("btn-overlay")
        let x = e.clientX - e.currentTarget.offsetLeft
        let y = e.clientY - e.currentTarget.offsetTop
        overlay.style.left = x + "px"
        overlay.style.top = y + "px"
        e.currentTarget.appendChild(overlay)

        setTimeout(()=>{
            overlay.remove()
        },500)
    }

    return(
        <button className={`iconbutton`} onClick={click} onContextMenu={onContextMenu} disabled={disabled}>
            <div className={`${className} iconbutton-container`}>
                {icon}
            </div>
        </button>
    )
}
