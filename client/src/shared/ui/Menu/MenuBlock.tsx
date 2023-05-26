import { IBlock } from "../../model/menu"
import { MenuItem } from "./MenuItem"

interface MenuItemProps{
    block: IBlock,
    smallDisplay: boolean
}

function MenuBlock({block, smallDisplay}:MenuItemProps) {

    function isIcon(block: IBlock){
        for(let item of block.items){
            if(item.icon)
                return true
        }
        return false
    }

    return(
        <div className="menu-block">
        {
            block.items.map((item, index)=>(
            <MenuItem key={index} item={item} isIcon={isIcon(block)} smallDisplay={smallDisplay}/> 
            ))
        }
        </div>
    )
}

export {MenuBlock}