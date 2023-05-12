import { useState } from "react"
import "./TimePickers.scss"
import { SelectTime } from "./SelectTime"
import { EnterTime } from "./EnterTime"

export const TimePickers = () => {

    const [minutes, setMinutes] = useState<number>(0)
    const [hours, setHours] = useState<number>(0)
    const [selectMode, setSelectMode] = useState<boolean>(false)

    if(selectMode)
        return(<SelectTime setMinutes={setMinutes} setHours={setHours} minutes={minutes} hours={hours} switchMode={()=>setSelectMode(false)}/>)

    return(<EnterTime setMinutes={setMinutes} setHours={setHours} minutes={minutes} hours={hours} switchMode={()=>setSelectMode(true)}/>)
}