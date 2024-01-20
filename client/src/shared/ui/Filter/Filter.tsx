import { Filter } from "lucide-react"
import { IconButton } from ".."
import { UseFilter } from "../../lib/hooks/filterMenu.hook"
import { useEffect } from "react"

interface FilterBtnProps{
    className?: string | undefined,
    style?: React.CSSProperties
    items: string[]
    onChange: (data: string[])=>void
}

export const FilterBtn = ({className, style, items, onChange}:FilterBtnProps) => {

    const {filter, togleMenu, setItems} = UseFilter()

    useEffect(()=>{
        onChange(filter)
    },[filter])

    useEffect(()=>{
        setItems(items)
    },[items])

    return(
        <IconButton className={`filter-btn ${className}`} style={{zIndex: 1000, ...style}} icon={<Filter/>} onClick={togleMenu}/>
    )
}