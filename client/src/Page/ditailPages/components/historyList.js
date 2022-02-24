import React from 'react'
import {dateFormat} from './utils'

export const HistoryList = ({records, title}) => {

console.log(records);
  return(
    <div className="historyList">
      <h3>{title||""}</h3>
      <ul>
      {
        records?.data?.map((item,index)=>{
          return(
            <li key={index}>
            <p>{item.y}</p>
            <p>{dateFormat(item.x)}</p>
            </li>
          )
        })
      }
      </ul>
    </div>
  )
}
