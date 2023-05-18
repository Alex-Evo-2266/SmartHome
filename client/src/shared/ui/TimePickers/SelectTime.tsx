import { Keyboard } from "lucide-react"
import { useCallback, useState } from "react"
import "./TimePickers.scss"
import { TextButton } from "../Button/Button"

interface HoursProps{
	setHours: (number:number)=>void
}

interface MinutesProps{
	setMinutes: (number:number)=>void
}

interface SelectTimeProps{
	setMinutes: (number:number)=>void
	setHours: (number:number)=>void
	switchMode: ()=>void
	minutes: number
	hours: number
	onCancel: ()=>void
	onOK: ()=>void
}


export const SelectTime = ({setHours, setMinutes, switchMode, hours, minutes, onCancel, onOK}:SelectTimeProps) => {

	const [minutePage, setMinutePage] = useState<boolean>(false)

	const changeHours = useCallback((hour:number) => {
		setHours(hour)
		setMinutePage(true)
	},[setHours])

	const changeMinuts = useCallback((minute:number) => {
		setMinutes(minute)
		setMinutePage(false)
	},[setMinutes])

	const hide = useCallback(() => {
		setMinutePage(false)
		onCancel()
	},[])

	return(
		<>
			<div className="time-type"><p className="text-sm">Select time</p></div>
			<div className="time-input-container">
				<div className="time-input hours"><div className="input-container"><input disabled type="number" min={0} max={23} value={hours}/></div><span className="text-sm">Hour</span></div>
				<div className="time-separator">:</div>
				<div className="time-input minutes"><div className="input-container"><input disabled type="number" value={minutes} min={0} max={60}/></div><span className="text-sm">Minute</span></div>
			</div>
			<div className="clock-input-container">
				{
					(minutePage)?
					<Minuts setMinutes={changeMinuts}/>:
					<Hours setHours={changeHours}/>
				}
			</div>
			<div className="enter-time-action">
				<div className="enter-time-icon" onClick={()=>switchMode()}><Keyboard/></div>
				<TextButton className="little" onClick={hide}>Cancel</TextButton>
				<TextButton className="little" onClick={onOK}>OK</TextButton>
			</div>
		</>
	)
}


function Hours({setHours}: HoursProps){
	return(
	<div className="clock-input">
		<div className="clock-input-am">
			<span onClick={()=>setHours(1)}>1</span>
			<span onClick={()=>setHours(2)}>2</span>
			<span onClick={()=>setHours(3)}>3</span>
			<span onClick={()=>setHours(4)}>4</span>
			<span onClick={()=>setHours(5)}>5</span>
			<span onClick={()=>setHours(6)}>6</span>
			<span onClick={()=>setHours(7)}>7</span>
			<span onClick={()=>setHours(8)}>8</span>
			<span onClick={()=>setHours(9)}>9</span>
			<span onClick={()=>setHours(10)}>10</span>
			<span onClick={()=>setHours(11)}>11</span>
			<span onClick={()=>setHours(12)}>12</span>
		</div>
		<div className="clock-input-pm">
			<span onClick={()=>setHours(13)}>13</span>
			<span onClick={()=>setHours(14)}>14</span>
			<span onClick={()=>setHours(15)}>15</span>
			<span onClick={()=>setHours(16)}>16</span>
			<span onClick={()=>setHours(17)}>17</span>
			<span onClick={()=>setHours(18)}>18</span>
			<span onClick={()=>setHours(19)}>19</span>
			<span onClick={()=>setHours(20)}>20</span>
			<span onClick={()=>setHours(21)}>21</span>
			<span onClick={()=>setHours(22)}>22</span>
			<span onClick={()=>setHours(23)}>23</span>
			<span onClick={()=>setHours(0)}>0</span>
		</div>
		<span className="center"></span>
	</div>
	)
}
	
function Minuts({setMinutes}: MinutesProps){
	return(
	<div className="clock-input">
		<div className="clock-input-minute">
			<span onClick={()=>setMinutes(0)}>00</span>
			<span onClick={()=>setMinutes(5)}>05</span>
			<span onClick={()=>setMinutes(10)}>10</span>
			<span onClick={()=>setMinutes(15)}>15</span>
			<span onClick={()=>setMinutes(20)}>20</span>
			<span onClick={()=>setMinutes(25)}>25</span>
			<span onClick={()=>setMinutes(30)}>30</span>
			<span onClick={()=>setMinutes(35)}>35</span>
			<span onClick={()=>setMinutes(40)}>40</span>
			<span onClick={()=>setMinutes(45)}>45</span>
			<span onClick={()=>setMinutes(50)}>50</span>
			<span onClick={()=>setMinutes(55)}>55</span>
		</div>
		<span className="center"></span>
	</div>
	)
}