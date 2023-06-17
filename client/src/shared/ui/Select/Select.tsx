import { getContainerData } from "../../lib/helpers/getModalCord"
import { useAppDispatch } from "../../lib/hooks/redux"
import { hideMenu, showBaseMenu } from "../../lib/reducers/menuReducer"
import { IMenuItem } from "../../model/menu"
import "./Select.scss"
import { useCallback, useState } from "react"

export interface IOption{
    title: string
    value: string
    // icon?: React.ReactNode
}

interface ISelectFieldProps{
    onChange?:(value: string)=>void
    value?: string
    placeholder?: string
    className?: string
    items: (IOption | string)[]
    border?: boolean
    name?: string
    error?: boolean
}

const getTitleByValue = (items:(IOption | string)[], value: string) => {
    for(let item of items)
    {
        if(typeof(item) === "string" && item === value)
            return item
        if(typeof(item) !== "string" && item.value === value)
            return item.title
    }
    return ""
}        

export const SelectField = ({items, onChange, value, placeholder, className, border, name, error}:ISelectFieldProps) => {

    const [selectTitle, setSelectTitle] = useState<string>(getTitleByValue(items, value ?? ""))
    const dispatch = useAppDispatch()

    const change = useCallback((data: string) => {
        setSelectTitle(getTitleByValue(items, data))
        onChange && onChange(data)
        dispatch(hideMenu())
    },[items])

    const selectMap = useCallback((item: IOption | string):IMenuItem => {
        if(typeof(item) === "string")
            return {title: item, onClick:()=>change(item)}
        return {title: item.title, onClick:()=>change(item.value)}
    },[])

    const show = useCallback((event: React.MouseEvent<HTMLDivElement>)=>{
        event.preventDefault()
        let data = getContainerData(event.currentTarget)
        let x = data?.left ?? event.pageX
        let y = (data?.top)?data.top + data.height : event.pageY
        dispatch(showBaseMenu(items.map(selectMap), x, y, data?.width))
    },[])

    return(
        <>
            <div className={`select-field ${className} ${border?"border":""}`}>
                <div className="input-container" onClick={show}>
                    <input
                    required 
                    type="text"
                    className={`${error?"error":""}`} 
                    name={name} 
                    value={selectTitle}
                    placeholder={placeholder}
                    readOnly
                    />
                    <span className="text-field-line"></span>
                </div>
            </div>
        </>
    )
}