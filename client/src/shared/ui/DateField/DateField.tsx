import { Clock3 } from "lucide-react"
import { useCallback, useState } from "react"
import "./DateField.scss"
import { СalendarPickers } from "./DatePickers"

interface ITimeFieldProps{
    onChange?:(value: string)=>void
    name?: string
    value?: string
    validEmptyValue?: boolean
    className?: string
    error?: boolean
}

export const DateField = ({onChange, name, value, className, validEmptyValue, error}:ITimeFieldProps) => {

    const [visible, setVisible] = useState<boolean>(false)
    const [dateValue, setDateValue] = useState<string>(value ?? "")

    const emptyValueClass = useCallback((validEmptyValue?:boolean) => {
        if(error)
            return "error"
        if(validEmptyValue && (!dateValue || dateValue === ""))
            return "error"
        return ""	
    },[dateValue])

    const click = () => {
        setVisible(true)
    }

    const formatMonth = (month: number):string => {
        let str = String(month + 1)
        if(str.length < 2)
            str = "0" + str
        return str
    }

    const formatDay = (day: number):string => {
        let str = String(day)
        if(str.length < 2)
            str = "0" + str
        return str
    }

    const change = useCallback((year: number, month: number, day: number) => {
        setDateValue(`${year}-${formatMonth(month)}-${formatDay(day)}`)
        onChange && onChange(`${year}-${formatMonth(month)}-${formatDay(day)}`)
    },[onChange])

    return(
        <>
        <div className={`date-field`}>
            <div className="icon-container" onClick={click}><Clock3/></div>
            <div className="input-container" onClick={click}>
                <input
                required 
                type="date" 
                className={`${className} ${emptyValueClass(validEmptyValue)}`} 
                name={name} 
                value={dateValue}
                />
                <span className="text-field-line"></span>
            </div>
		</div>
        {
            (visible)?
            <div className={`select-date-dialog`}>
                <div className="backplate" onClick={()=>setVisible(false)}></div>
                <СalendarPickers onChange={change} onHide={()=>setVisible(false)}/>
            </div>:null
        }
        </>
        
    )
}