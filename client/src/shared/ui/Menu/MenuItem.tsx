import { Check } from "lucide-react"
import { IMenuItem } from "../../model/menu"
import { useCallback, useState } from "react"
import { SubMenuItemBlock } from "./SubMenuItemBlock"
import { useAppDispatch, useAppSelector } from "../../lib/hooks/redux"
import { hideMenu } from "../../lib/reducers/menuReducer"

interface MenuItemProps{
    item: IMenuItem
    isIcon: boolean
    smallDisplay: boolean
}

const MenuItem = ({item, isIcon, smallDisplay}:MenuItemProps) => {

    const [visible, setVisible] = useState<boolean>(false)
    const menu = useAppSelector(state=>state.menu)
    const dispath = useAppDispatch()

    const subMenuToggle = useCallback(() => {
        if(item.subItems)
            setVisible(prev=>!prev)
        else
            item.onClick && item.onClick()
        if(menu.autoHide)
            dispath(hideMenu())
    },[menu, item.onClick])

    return(
        <div className="menu-item-conatiner">
            <div className="menu-item" onClick={subMenuToggle}>
                {
                    (isIcon)?
                    <div className="menu-icon-container">
                        {item.icon}
                    </div>:
                    null
                }
                <div className="menu-text-container">
                    {item.title}
                </div>
                <div className="menu-status-container">
                    {
                        (item.subItems)?
                        <span className={`menu-status-submenu ${visible?"active":""}`}></span>:
                        (item.activated)?
                        <Check/>:
                        null
                    }
                </div>
            </div>
                {
                    (visible && item.subItems)?
                    <SubMenuItemBlock items={item.subItems} onHide={()=>setVisible(false)} smallDisplay={smallDisplay}/>:
                    null
                }
        </div>
    )
}

export {MenuItem}