import React, { useState } from "react"
import "./SigmentedButton.scss"
import { Check } from "lucide-react"

interface SigmentedButtonProps{
    className?: string
    onClick?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    onContextMenu?: (event:React.MouseEvent<HTMLButtonElement>)=>void
    onChange?: (value: string[], event?:React.MouseEvent<HTMLButtonElement>)=>void
    items: string[]
    value?: string[] | string
    multiple?: boolean
  }

const getValue = (value?: string[] | string) => {
    if(value === undefined)
        return []
    if(Array.isArray(value))
        return value
    return [value]
}

export const SigmentedButton = ({multiple, value, items, className, onClick, onContextMenu, onChange}: SigmentedButtonProps) => {

    const [values, setValues] = useState<string[]>(getValue(value))

    const click = (e:React.MouseEvent<HTMLButtonElement>) => {
        onClick && onClick(e)
        const button: HTMLButtonElement = e.currentTarget
        if(!multiple)
        {
            if(!button.dataset["el"])
                return
            setValues([button.dataset["el"]])
            onChange && onChange([button.dataset["el"]], e)
            return
        }
        const condidat = values.filter(item=>item === button.dataset["el"])
        let newValues = values.slice()
        if(condidat.length > 0 && button.dataset["el"])
            newValues = newValues.filter(item=>item !== button.dataset["el"])
        else if(button.dataset["el"])
            newValues.push(button.dataset["el"])
        setValues(newValues)
        onChange && onChange(newValues, e)
    }

    return(
    <div className={`sigmentedbutton-container ${className ?? ""}`}>
    {
        items.map((item, index)=>(
            <div className="sigmentedbutton-item-container" key={index}>
                <button data-el={item} onContextMenu={onContextMenu} onClick={click} key={index} className={`sigmentedbutton-item-button ${(values.includes(item))?"active":""}`}>
                    {(values.includes(item))?<div className="icon-container"><Check/></div>:null}
                    <div className="text-container">{item}</div>
                </button>
            </div>
        ))
    }
    </div>
    )
}
    

