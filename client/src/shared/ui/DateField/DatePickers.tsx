import { useState } from "react";
import "./DatePickers.scss"
import { Check, ChevronDown } from "lucide-react";

const MAX_YEAR = 2050
const MIN_YEAR = 1900

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

const getYears = () => {
    return Array(MAX_YEAR - MIN_YEAR).fill(0).map((_, index)=>MIN_YEAR + index)
}

enum СalendarPage {
	DAYS = "DAYS",
	MONTHS = "MONTHS",
	YEARS = "YEARS"
}

interface IDay{
    day:number
    type: string
}

interface IСalendarPickersProps{
    onChange?:(year: number, month:number, day:number)=>void
}

export const СalendarPickers = ({onChange}:IСalendarPickersProps) => {

    const [nowMonth] = useState<string>(months[new Date().getMonth()])
    const [nowYear] = useState<number>(new Date().getFullYear())
    const [nowDate] = useState<number>(new Date().getDate())

    const [month, setMonth] = useState<string>(months[new Date().getMonth()])
    const [year, setYear] = useState<number>(new Date().getFullYear())
    // const [date, setDate] = useState<number>(new Date().getDate())

    const [page, setPage] = useState<СalendarPage>(СalendarPage.DAYS)

	const getMonthDays = (year: number, month: number) => {
		return new Date(year, month + 1, 0).getDate();
	}

	const getDay = (year: number, mouth: number, day: number) => {
		let data = new Date(year, mouth, day)
		return data.getDay()
	}

	const getDataMount = (year: number, month: number) => {
		let data = Array(getMonthDays(year, month))
					.fill(0)
					.map((_, index) => ({type: "month", day: index + 1}))
		let endDay = getDay(year, month, getMonthDays(year, month))
		let nextMount = Array(7 - endDay)
						.fill(0)
						.map((_, index) => ({type: "nextMonth", day: index + 1}))
		let prevMount = Array(getDay(year, month, 0))
						.fill(0)
						.map((_, index) => ({type:"prevMonth", day:getMonthDays((!month)?year-1:year, (!month)?11:month - 1) - index}))
						.reverse()
		data = prevMount.concat(data).concat(nextMount)
		return data
	}

    const selectYear = (year:number) => {
        setPage(СalendarPage.DAYS)
        setYear(year)
    }
    
    const selectMonth = (month:string) => {
        setPage(СalendarPage.DAYS)
        setMonth(month)
    }

    const selectDay = (day: IDay) => {
        // onChange(year)
    }

	return(
		<div className="calendar-body-container">
			<div className="calendar-body-select-container">
                <div className="month" ><span className={page===СalendarPage.MONTHS?"active":""} onClick={()=>setPage(СalendarPage.MONTHS)}>{month} <ChevronDown/></span></div>
                <div className="years"><span className={page===СalendarPage.YEARS?"active":""} onClick={()=>setPage(СalendarPage.YEARS)}>{year} <ChevronDown/></span></div>
			</div>
            {
                (page === СalendarPage.MONTHS)?
                <div className="calendar-body-months-container">
                {
                    months.map((item, index)=>(
                        <div key={index} className="calendar-body-months-item" onClick={()=>selectMonth(item)}>
                            <div className="status-container">
                            {
                                (month === item)?<Check/>:null
                            }
                            </div>
                            <div className="content">{item}</div>
                        </div>
                    ))
                }
			    </div>:
                (page === СalendarPage.YEARS)?
                <div className="calendar-body-years-container">
                {
                    getYears().map((item, index)=>(
                        <div key={index} className="calendar-body-year-item" onClick={()=>selectYear(item)}>
                            <div className="status-container">
                            {
                                (year === item)?<Check/>:null
                            }
                            </div>
                            <div className="content">{item}</div>
                        </div>
                    ))
                }
			    </div>:
                <>
                    <div className="calendar-body-dayofweek-container">
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                        <span>S</span>
                    </div>
                    <div className="calendar-body-days-container">
                    {
                        getDataMount(year, months.indexOf(month)).map((item, index)=>(
                            <div className={`day ${(item.type !== "month")?"other":""} ${(nowDate === item.day && year === nowYear && month === nowMonth)?"now":""}`} key={index} onClick={()=>selectDay(item)}>
                                {item.day}
                            </div>
                        ))
                    }
                    </div>
                </>
                
            }
			
			<div className="calendar-body-action-container">
				
			</div>
		</div>
	)
}