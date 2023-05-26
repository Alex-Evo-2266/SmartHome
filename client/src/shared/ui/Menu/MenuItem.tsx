import { Check } from "lucide-react"
import { IMenuItem } from "../../model/menu"
import { useState } from "react"
import { SubMenuItemBlock } from "./SubMenuItemBlock"

interface MenuItemProps{
    item: IMenuItem
    isIcon: boolean
    smallDisplay: boolean
}



const MenuItem = ({item, isIcon, smallDisplay}:MenuItemProps) => {

    const [visible, setVisible] = useState<boolean>(false)

    const subMenuToggle = () => {
        if(item.subItems)
            setVisible(prev=>!prev)
        else
            item.onClick && item.onClick()
    }

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