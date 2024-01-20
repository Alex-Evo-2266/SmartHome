import { Filter } from "lucide-react"
import { IconButton } from ".."
import { useCallback, useEffect, useState } from "react"
import { useMenu } from "../../lib/hooks/menu.hook"
import { IMenuItem } from "../../model/menu"

interface FilterBtnProps{
    className?: string | undefined,
    style?: React.CSSProperties
    items: string[]
    onChange: (data: string[])=>void
}

export const FilterBtn = ({className, style, items, onChange}:FilterBtnProps) => {

    const {init, show, updateItems} = useMenu()
    const [filter, setFilter] = useState<string[]>([])

    const isActivated = useCallback((name: string) => filter.includes(name),[filter])

    const togle = useCallback((name:string)=>{
        setFilter(prev=>{
            if(prev.includes(name))
            {
                onChange(prev.filter(item=>item != name))
                return prev.filter(item=>item != name)
            }
            else
            {
                onChange([...prev, name])
                return [...prev, name]
            }
        })
    },[])

    const getMenu = useCallback(()=>{
        let arr: IMenuItem[] = items.map(item=>({
            title: item,
            activated: isActivated(item),
            onClick: ()=>togle(item)
        }))
        return arr
    },[isActivated, items, togle, filter])

    const togleMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
        init(event.pageX, event.pageY, getMenu())
        show()
    },[show, init, getMenu])

    useEffect(()=>{
        updateItems(getMenu())
    },[filter, getMenu])

    return(
        <IconButton className={`filter-btn ${className}`} style={{zIndex: 1000, ...style}} icon={<Filter/>} onClick={togleMenu}/>
    )
}