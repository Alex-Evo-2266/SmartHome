import React, {useContext,useState} from 'react'
import {DialogWindowContext} from '../dialogWindowContext'

export const ConfirmationDialog = ()=>{
  const {dialog, hide} = useContext(DialogWindowContext)
  const [data, setData] = useState("")

  const active = ()=>{
    if(typeof(dialog.active)==="function")
      dialog.active(data)
    hide()
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{dialog.title}</div>
      <div className="dividers"></div>
      <div className="dialogBody scroll">
        {dialog.items?.map((item, index)=>{
          return(
            <label key={index} className="dialogItem">
              <input type="radio" name="data" value={item.data} checked={data===item.data} onChange={()=>setData(item.data)}/>
              <p>{item.title}</p>
            </label>
          )
        })}
      </div>
      <div className="dividers"></div>
      <div className="dialogFooter">
        <button className="dialogButton button normalSelection" onClick={hide}>CANCEL</button>
        <button className="dialogButton button normalSelection" onClick={active} disabled={data===""}>OK</button>
      </div>
    </div>
    </>
  )
}
