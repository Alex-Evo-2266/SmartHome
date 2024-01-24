import { useCallback, useState } from "react"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { DayOfWeekField, FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { getFormattedTime } from '../../../shared/lib/helpers/timeFormat'

interface AutomationTimeProps{
	onChange: (data: string)=>void 
}

const periodItems = [
    {title: "every hour", value: "every_hour"},
    {title: "every day", value: "every_day"},
    {title: "every month", value: "every_month"},
    {title: "every year", value: "every_year"}
]

const monthItems = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const getDays = (month: number) => {
    return new Date(2024, month, 0).getDate();
}
export const AutomationEntitiesPeriodDialog = ({onChange}:AutomationTimeProps) => {

    const dispatch = useAppDispatch()
    const [period, setPeriod] = useState<string>("every_hour")
    const [month, setMonth] = useState<string>("January")
    const [dayWeek, setDayWeek] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
    const [day, setDay] = useState<string>("1")
    const [hour, setHour] = useState<number>(0)
    const [minute, setMinute] = useState<number>(0)

    const hide = () => {
		dispatch(hideFullScreenDialog())
	}

    const save = useCallback(() => {
        if (period === "every_year")
            onChange(`${period}.${month}.${day}.${getFormattedTime(hour, minute)}`)
        if (period === "every_month")
            onChange(`${period}.${day}.${getFormattedTime(hour, minute)}`)
        if (period === "every_day")
            onChange(`${period}[${dayWeek.join(',')}].${getFormattedTime(hour, minute)}`)
        if (period === "every_hour")
            onChange(`${period}.${minute}`)
	},[period, month, day, hour, minute, dayWeek])

    const changeNumberField = (value: number, min: number, max: number, name: string) => {
        if (value > max)
            value = max
        if (value < min)
            value = min
        if(name === "day")
            setDay(String(value))
        if(name === "hour")
            setHour(value)
        if(name === "minute")
            setMinute(value)
    }

    return(
        <FullScrinTemplateDialog onHide={hide} onSave={save} header={"Trigger"}>
            <FieldContainer header="Period">
                <SelectField border items={periodItems} onChange={data=>setPeriod(data)} value={period}/>
            </FieldContainer>
            {
                (period === "every_year")?
                <FieldContainer header="month">
                    <SelectField border items={monthItems} onChange={data=>setMonth(data)} value={month}/>
                </FieldContainer>:
                null
            }
            {
                (period === "every_month" || period === "every_year")?
                <FieldContainer header="day">
                    <TextField border max={getDays(monthItems.indexOf(month) + 1)} min={1} type="number" onChange={e=>changeNumberField(Number(e.target.value), 0, getDays(monthItems.indexOf(month) + 1), "day")} value={day}/>
                </FieldContainer>:
                null
            }
            {
                (period === "every_day")?
                <FieldContainer header="day">
                    <DayOfWeekField value={dayWeek} onChange={(data)=>setDayWeek(data)}/>
                </FieldContainer>:
                null
            }
            {
                (period === "every_month" || period === "every_year" || period === "every_day")?
                <FieldContainer header="hour">
                    <TextField border max={23} min={0} type="number" onChange={e=>changeNumberField(Number(e.target.value), 0, 23, "hour")} value={hour}/>
                </FieldContainer>:
                null
            }
            <FieldContainer header="minute">
                <TextField border max={59} min={0} type="number" onChange={e=>changeNumberField(Number(e.target.value), 0, 59, "minute")} value={minute}/>
            </FieldContainer>
        </FullScrinTemplateDialog>
    )
}