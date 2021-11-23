import React,{useState,useEffect,useContext,useCallback} from 'react'
import {SocketContext} from '../../context/SocketContext'

export const TriggerDateTime = ({deviceId,action,updata,index,el,block,deleteEl})=>{
  const [frequency, setFrequency] = useState(action?.frequency||"everyday")
  const [time, setTime] = useState(action?.time||null)
  const [date, setDate] = useState(action?.date||1)

  const change = (event)=>{
    if(event.target.name === "frequency")
    {
      setFrequency(event.target.value)
      updata({index,action:{
        frequency:event.target.value,
        time,
        date
      }})
    }
    if(event.target.name === "time")
    {
      setTime(event.target.value)
      updata({index,action:{
        frequency,
        time:event.target.value,
        date
      }})
    }
    if(event.target.name === "date")
    {
      setDate(event.target.value)
      updata({index,action:{
        frequency,
        time,
        date:event.target.value
      }})
    }
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-content-item programm-function-block-name">
        datetime
      </div>
      <div className="programm-function-block-content-item">
        <select value={frequency} onChange={change} name="frequency">
            <option value="everyday">everyday</option>
            <option value="everyhour">every hour</option>
            <option value="everyweek">every week</option>
            <option value="everymonth">every month</option>
        </select>
      </div>
      {
        (frequency==="everyday")?
        <div className="programm-function-block-content-item">
          <input type="time" name="time" value={time} onChange={change}/>
        </div>:
        (frequency==="everymonth")?
        <>
        <div className="programm-function-block-content-item">
          <input type="number" name="date" min={1} max={31} value={date} onChange={change}/>
        </div>
        <div className="programm-function-block-content-item">
          <input type="time" name="time" value={time} onChange={change}/>
        </div>
        </>:
        (frequency==="everyweek")?
        <>
        <div className="programm-function-block-content-item">
          <select value={date} name="date" onChange={change} name="date">
            <option value={1}>Monday</option>
            <option value={2}>Tuesday</option>
            <option value={3}>Wednesday</option>
            <option value={4}>Thursday</option>
            <option value={5}>Friday</option>
            <option value={6}>Saturday</option>
            <option value={7}>Sunday</option>
          </select>
        </div>
        <div className="programm-function-block-content-item">
          <input type="time" name="time" value={time} onChange={change}/>
        </div>
        </>:null
      }
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl(index,block)}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
