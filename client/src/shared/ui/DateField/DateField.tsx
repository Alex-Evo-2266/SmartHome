import { CalendarDays } from "lucide-react"
import { useCallback, useState } from "react"
import "./DateField.scss"
import { useDispatch } from "react-redux"
import { hideDialog, showDialog } from "../../lib/reducers/dialogReducer"
import {СalendarPickers} from 'alex-evo-sh-ui-kit'

interface ITimeFieldProps{
    onChange?:(value: string)=>void
    name?: string
    value?: string
    validEmptyValue?: boolean
    className?: string
    error?: boolean
    border?: boolean
}

export const DateField = ({border, onChange, name, value, className, validEmptyValue, error}:ITimeFieldProps) => {

    const [dateValue, setDateValue] = useState<string>(value ?? "")
    const dispatch = useDispatch()

    const emptyValueClass = useCallback((validEmptyValue?:boolean) => {
        if(error)
            return "error"
        if(validEmptyValue && (!dateValue || dateValue === ""))
            return "error"
        return ""	
    },[dateValue])

    const click = () => {
        dispatch(showDialog(<СalendarPickers onChange={change} onHide={()=>dispatch(hideDialog())}/>))
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
        <div className={`date-field ${border?"border":""}`}>
            <div className="icon-container" onClick={click}><CalendarDays/></div>
            <div className="input-container" onClick={click}>
                <input
                required 
                type="date" 
                className={`${className} ${emptyValueClass(validEmptyValue)}`} 
                name={name} 
                value={dateValue}
                readOnly
                />
                <span className="text-field-line"></span>
            </div>
		</div>
        </>
        
    )
}