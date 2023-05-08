import "./Select.scss"
import { useState } from "react"

export interface IOption{
    title: string
    value: string
    icon?: React.ReactNode
}

interface ISelectFieldProps{
    onChange?:(value: string)=>void
    value?: string
    placeholder?: string
    className?: string
    items: (IOption | string)[]
}

const getValue = (item:IOption | string) => (typeof(item) === "string")?item:item.value
const getTitle = (item:IOption | string) => (typeof(item) === "string")?item:item.title

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

export const SelectField = ({items, onChange, value, placeholder, className}:ISelectFieldProps) => {

    const [visible, setVisible] = useState<boolean>(false)
    const [selectTitle, setSelectTitle] = useState<string>(getTitleByValue(items, value ?? ""))

    const change = (title: string, value:string) => {
        setVisible(false)
        setSelectTitle(title)
        onChange && onChange(value)
    }
   
    return(
        <div className={`dropdown ${className} ${(visible)?"active":""}`}>
            <div className="backplate" onClick={()=>setVisible(false)}></div>
            <input type="text" onClick={()=>setVisible(prev=>!prev)} className="textBox" placeholder={placeholder} value={selectTitle} readOnly/>
            <div className={`options`}>
            {
                items.map((item, index)=>(
                    <div key={index} onClick={()=>change(getTitle(item), getValue(item))} data-value={getValue(item)}>{(typeof(item) !== "string" && item.icon)?item.icon:null}{getTitle(item)}</div>
                ))
            }
            </div>
        </div>
    )
}