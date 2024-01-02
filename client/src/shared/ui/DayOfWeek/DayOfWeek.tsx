import { useCallback, useState } from "react"
import { Checkbox } from ".."
import './DayOfWeek.scss'

interface ITimeFieldProps{
    onChange?:(value: string[])=>void
    name?: string
    value?: string[]
    className?: string
}

export const DayOfWeekField = ({onChange, name, value, className}:ITimeFieldProps) => {

    const [days, setDays] = useState<string[]>(value || [])

    const changeDay = useCallback((data: React.ChangeEvent<HTMLInputElement> | undefined) => {
        if (!data)
            return
        let newData = days.slice()
        const index =  newData.indexOf(data.target.name)
        if(index !== -1 && ! data.target.checked)
            newData = newData.filter((_, index1)=>index1 !== index)
        else if(index === -1 && data.target.checked)
            newData.push(data.target.name)
        setDays(newData)
        onChange && onChange(newData)
    },[days])

    const getChecked = useCallback((day: string) => {
        return (days.indexOf(day) !== -1)
    },[days])
   
    return(
        <>
        <div className={`days-week-field-container ${className}`}>
            <label>
                <input type="checkbox" onChange={changeDay} name="Mon" checked={getChecked("Mon")}/>
                <span>Mon</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Tue" checked={getChecked("Tue")}/>
                <span>Tue</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Wed" checked={getChecked("Wed")}/>
                <span>Wed</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Thu" checked={getChecked("Thu")}/>
                <span>Thu</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Fri" checked={getChecked("Fri")}/>
                <span>Fri</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Sat" checked={getChecked("Sat")}/>
                <span>Sat</span>
            </label>
            <label>
                <input type="checkbox" onChange={changeDay} name="Sun" checked={getChecked("Sun")}/>
                <span>Sun</span>
            </label>
		</div>
        </>
        
    )
}