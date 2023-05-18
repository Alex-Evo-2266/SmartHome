import { Clock3 } from "lucide-react"
import "./TimePickers.scss"
import { TextButton } from "../Button/Button"

interface SelectTimeProps{
	setMinutes: (number:number)=>void
	setHours: (number:number)=>void
	switchMode: ()=>void
	minutes: number
	hours: number
    onCancel:()=>void
    onOK:()=>void
}

export const EnterTime = ({setHours, setMinutes, switchMode, minutes, hours, onCancel, onOK}:SelectTimeProps) => {

    const changeHours = (e:React.ChangeEvent<HTMLInputElement>) => {
        let hour = Number(e.target.value)
        if(hour < 0)
            hour = 0
        if(hour > 23)
            hour = 23
        setHours(hour)
    }

    const changeMinuts = (e:React.ChangeEvent<HTMLInputElement>) => {
        let minute = Number(e.target.value)
        if(minute < 0)
            minute = 0
        if(minute > 59)
            minute = 59
        setMinutes(minute)
    }

    return(
        <>
            <div className="time-type"><p className="text-sm">Enter time</p></div>
            <div className="time-input-container">
                <div className="time-input hours"><div className="input-container"><input type="number" min={0} max={23} value={hours} onChange={changeHours}/></div><span className="text-sm">Hour</span></div>
                <div className="time-separator">:</div>
                <div className="time-input minutes"><div className="input-container"><input type="number" value={minutes} min={0} max={59} onChange={changeMinuts}/></div><span className="text-sm">Minute</span></div>
            </div>
            <div className="enter-time-action">
                <div className="enter-time-icon" onClick={()=>switchMode()}><Clock3/></div>
                <TextButton className="little" onClick={onCancel}>Cancel</TextButton>
                <TextButton className="little" onClick={onOK}>OK</TextButton>
            </div>
        </>
    )
}