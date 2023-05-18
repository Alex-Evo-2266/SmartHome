import { useCallback, useState } from "react"
import "./TimePickers.scss"
import { SelectTime } from "./SelectTime"
import { EnterTime } from "./EnterTime"
import { useAppSelector } from "../../hooks/redux"
import { BasicTemplateDialog } from "../Dialog/TemplateDialog/BasicDialog"

export const TimePicker = () => {

    const props = useAppSelector(state => state.timePicker)
    const [minutes, setMinutes] = useState<number>(props.minutes ?? 0)
    const [hours, setHours] = useState<number>(props.hours ?? 0)
    const [selectMode, setSelectMode] = useState<boolean>(true)

    const hide = () => {
        props.onHide && props.onHide()
        setMinutes(0)
        setHours(0)
    }

    const setMenuAndExit = useCallback((minutes: number) => {
        setMinutes(minutes)
        props.onChange && props.onChange(hours, minutes)
        props.onHide && props.onHide()
    },[hours])

    const OK = useCallback(()=>{
        props.onChange && props.onChange(hours, minutes)
        props.onHide && props.onHide()
    },[hours, minutes])

    console.log(props)

    if(!props.visible)
        return(null)

    if(selectMode)
        return(
            <BasicTemplateDialog className="enter-time-container">
                <SelectTime setMinutes={setMenuAndExit} setHours={setHours} minutes={minutes} hours={hours} switchMode={()=>setSelectMode(false)} onCancel={hide} onOK={OK}/>
            </BasicTemplateDialog>
        )

    return(
        <BasicTemplateDialog className="enter-time-container">
            <EnterTime setMinutes={setMinutes} setHours={setHours} minutes={minutes} hours={hours} switchMode={()=>setSelectMode(true)} onCancel={hide} onOK={OK}/>
        </BasicTemplateDialog>
   )
}