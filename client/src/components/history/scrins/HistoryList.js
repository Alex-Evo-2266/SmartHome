import React from 'react'
import {toDate} from '../utils'

export const HistoryList = ({data,device})=>{
  return (
    <div className="historyList">
      <div className="title">{`${data.deviceName}-${data.name}`}</div>
      {
        data.data.map((item)=>{
          return(
            <div className="historyItem">
              <div className="date">{toDate(item.x)}</div>
              <div className="value">{item.y}</div>
            </div>
          )
        })
      }
    </div>
  )
}
