import { useCallback, useEffect, useState } from 'react'
import './BigContainer.scss'
import { IPoint } from '../../model/point'

interface BigContainerProps{
    children?: React.ReactNode
    className?: string
    height?: string
    width?: string
    id?: string
    exceptionsClass?: string
    pozMove?: IPoint
}

export const BigContainer = ({children, className, id, exceptionsClass, height, width, pozMove}:BigContainerProps) => {
    const [downButton, setDownButton] = useState<boolean>(false)
    const [oldPozMouse, setOldPozMouse] = useState<IPoint | null>(null)
    const [poz, setPoz] = useState<IPoint>({x:0,y:0})

    const up = (e:React.MouseEvent<HTMLDivElement>)=>{
        if(e.button == 1)
        {
            setDownButton(false)
            setOldPozMouse(null)
            document.body.style.cursor = 'auto';
        }
    }

    const down = (e:React.MouseEvent<HTMLDivElement>)=>{
        if(e.button == 1)
        {
            
            setOldPozMouse({x: e.clientX, y: e.clientY})
            setDownButton(true)
            document.body.style.cursor = 'move';
        }
    }

    const move = useCallback((e:React.MouseEvent<HTMLDivElement>)=>{
        if (downButton){
            // const dataPoz = e.currentTarget.getBoundingClientRect()
            setPoz(prev=>{
                if(!oldPozMouse)
                    return prev
                const deltaX = e.clientX - oldPozMouse.x
                const deltaY = e.clientY - oldPozMouse.y
                let newX = prev.x + deltaX
                let newY = prev.y + deltaY
                return {x: newX, y: newY}
            })
            setOldPozMouse({x: e.clientX, y: e.clientY})
        }
    },[downButton, oldPozMouse])

    useEffect(()=>{
        if (pozMove)
        {
            setPoz({...pozMove})
        }
    },[pozMove])

    return(
        <div id={id} style={{height, width}} className={`big-container ${className}`} onMouseDown={down} onMouseUp={up} onMouseMove={move}>
            <div className="big-container-content" style={{left: poz.x, top: poz.y}}>
                {children}
            </div>
        </div>
    )
}