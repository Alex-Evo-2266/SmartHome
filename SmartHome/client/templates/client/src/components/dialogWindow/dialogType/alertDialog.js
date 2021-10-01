import React, {useContext,useState} from 'react'
import {DialogWindowContext} from '../dialogWindowContext'

export const AlertDialog = ()=>{
  const {dialog, hide} = useContext(DialogWindowContext)

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{dialog.title}</div>
      <div className="dialogBody">
        <p>{dialog.text}</p>
      </div>
      <div className="dialogFooter" onClick={hide}>
      {
        dialog?.buttons?.map((item, index)=>{
          return(
            <button key={index} className="dialogButton button normalSelection" onClick={item.action}>{item.title}</button>
          )
        })
      }
      </div>
    </div>
    </>
  )
}
