import { Check } from "lucide-react"
import { IMenuSubItem } from "../../model/menu"

interface MenuItemProps{
    item: IMenuSubItem
    isIcon: boolean
}

const SubMenuItem = ({item, isIcon}:MenuItemProps) => {

    return(
        <div className="menu-sub-item" onClick={item.onClick}>
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
                    (item.activated)?
                    <Check/>:
                    null
                }
            </div>
        </div>
    )
}

export {SubMenuItem}