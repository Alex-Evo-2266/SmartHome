import { Check } from "lucide-react"
import { IMenuSubItem } from "../../model/menu"
import { useAppSelector } from "../../lib/hooks/redux"

interface MenuItemProps{
    item: IMenuSubItem
    isIcon: boolean
}

const SubMenuItem = ({item, isIcon}:MenuItemProps) => {

    const menu = useAppSelector(state=>state.menu)

    const click = () => {
        item.onClick && item.onClick()
        menu.onClick && menu.onClick()
    }

    return(
        <div className="menu-sub-item" onClick={click}>
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