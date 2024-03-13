
import { useState } from 'react'
import './ScriptItem.scss'
import { HEIGHT, WIDTH } from '../models/const'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { IMenuItem } from '../../../shared/model/menu'

interface ScriptItemProps{
    text?: string
    title: string
    type: string
    icon: React.ReactNode
    style?: React.CSSProperties
    className?: string
    children?: React.ReactNode
    menuItem?: IMenuItem[]
}

export const ScriptItem = ({title, type, text, icon, style, className, children, menuItem}:ScriptItemProps) => {

    const [visible, setVisible] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const menu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        if(menuItem)
        {
            dispatch(showBaseMenu(menuItem, e.clientX, e.clientY))
        }
    }

    return(
        <div data-type={type} className={`script-item ${className} ${visible?"active":""}`} style={{width: WIDTH, height: HEIGHT, ...style}} onContextMenu={menu}>
            <div className='script-item-min-info' onClick={()=>setVisible(prev=>!prev)}>
                <div className='script-item-icon'>{icon}</div>
                <div className='script-item-min-content'>
                    <h3>{title}</h3>
                    {(text)?<p>{text}</p>:null}
                </div>
            </div>
            <div className='content'>
                {children}
            </div>
        </div>
    )
}