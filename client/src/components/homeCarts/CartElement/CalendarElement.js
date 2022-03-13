import React,{useContext, useEffect, useState, useCallback} from 'react'
import {BaseElement} from './BaseElement'
import {ServerConfigContext} from  '../../../context/ServerConfigContext'
import {getDayMount,getMonthStr} from './utils'

export const CalendarElement = ({deleteBtn,editBtn,index,data}) =>{
  const serverConfig = useContext(ServerConfigContext)
  const [days, setDays] = useState([])

  const convertDateFormat = useCallback((date)=>{
    if(!date)return null
    let d = date.split('.');
    d = d.reverse()
    return d.join('-')
  },[])

  useEffect(()=>{
    let naw = new Date(convertDateFormat(serverConfig.date))
    let days = getDayMount(naw.getMonth(), naw.getFullYear())
    days = days.map((item)=>{
      if(item.getDate() !== naw.getDate())
        return {type:"", day:item}
      return {type:"naw", day:item}
    })
    let count = days[0].day.getUTCDay()
    let day = new Date(days[0].day)
    for (let i = 1; i <= count; i++) {
      day.setDate(day.getDate() - 1)
      days.unshift({type:"prev", day:new Date(day)})
    }
    count = days[days.length - 1].day.getUTCDay()
    day = new Date(days[days.length - 1].day)
    for (let i = 6; i > count; i--) {
      day.setDate(day.getDate() + 1)
      days.push({type:"next", day:new Date(day)})
    }
    setDays(days)
  },[serverConfig.date, convertDateFormat])

  if(data.data.height >= 2 && data.data.width >= 3)
  {
    return(
      <BaseElement
      deleteBtn = {(data.editmode)?deleteBtn:null}
      editBtn={(data.editmode)?editBtn:null}
      index={index}
      data={data.data}
      >
        <div className="calendar">
          <div className="NawMonth">
            <p>{getMonthStr(new Date().getMonth())} {new Date().getFullYear()}</p>
          </div>
          <div className="calendar-grid">
            <div className="">Mon</div>
            <div className="">Tue</div>
            <div className="">Wed</div>
            <div className="">Thu</div>
            <div className="">Fri</div>
            <div className="">Sat</div>
            <div className="">Sun</div>
            {
              days.map((item, index)=>{
                return(
                  <div className={item.type} key={index}>{item.day.getDate()}</div>
                )
              })
            }
          </div>
        </div>
      </BaseElement>
    )
  }

  return(
    <BaseElement
    deleteBtn = {(data.editmode)?deleteBtn:null}
    editBtn={(data.editmode)?editBtn:null}
    index={index}
    data={data.data}
    >
      <div className="calendar">
        <div className="NawMonth" style={{height: "calc(100% - 20px)", fontSize:"25px"}}>
          <p>{new Date().getDate()} {getMonthStr(new Date().getMonth(), data.data.width === 1)} {new Date().getFullYear()}</p>
        </div>
      </div>
    </BaseElement>
  )
}
