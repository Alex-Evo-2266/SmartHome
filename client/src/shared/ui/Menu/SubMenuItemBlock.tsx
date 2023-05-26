import { useEffect, useRef, useState } from "react"
import { IMenuSubItem } from "../../model/menu"
import { SubMenuItem } from "./SubMenuItem"
import { getContainerData, getModalWindowCord } from "../../lib/helpers/getModalCord"

interface MenuItemProps{
    items: IMenuSubItem[]
    onHide: ()=>void
    smallDisplay: boolean
}

interface ICord{
	left: string
	top: string
}

const SubMenuItemBlock = ({items, onHide, smallDisplay}:MenuItemProps) => {

    const container = useRef<HTMLDivElement>(null)
    const [cord, setCord] = useState<ICord>({left:"0px", top:"0px"})

    function isIcon(items: IMenuSubItem[]){
        for(let item of items){
            if(item.icon)
                return true
        }
        return false
    }

    useEffect(()=>{
        if(!container.current)
            return
        let rootContainerData = getContainerData(container.current.parentElement)
        if(!rootContainerData)
            return
        let data = getModalWindowCord(rootContainerData.left + rootContainerData.width, rootContainerData.top, container.current, {marginRight: rootContainerData.width})
        setCord({
            left: data.x - rootContainerData.left + "px",
            top: data.y - rootContainerData.top + "px"
        })
	},[])

    return(
        <>
            <div ref={container} className="menu-sub-block" style={{...cord}}>
            {
                items.map((item, index)=>(
                <SubMenuItem key={index} item={item} isIcon={isIcon(items)}/> 
                ))
            }
            </div>
            {
                smallDisplay?
                null:
                <div style={{zIndex: 4}} className="backplate" onClick={onHide}></div>
            }
        </>
    )
}

export {SubMenuItemBlock}