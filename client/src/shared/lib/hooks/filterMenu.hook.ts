import { useCallback, useEffect, useState } from "react"
import { useMenu } from "../../lib/hooks/menu.hook"
import { IMenuItem } from "../../model/menu"

export const UseFilter = (initData: string[] = []) => {

    const {init, show, updateItems} = useMenu()
    const [filter, setFilter] = useState<string[]>(initData)
    const [items, setItems] = useState<string[]>([])

    const isActivated = useCallback((name: string) => filter.includes(name),[filter])

    const togle = useCallback((name:string)=>{
        setFilter(prev=>{
            if(prev.includes(name))
                return prev.filter(item=>item != name)
            else
                return [...prev, name]
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

    return {filter, togleMenu, setItems}
}