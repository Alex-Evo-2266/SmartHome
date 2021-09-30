import React, {useContext,useState} from 'react'
import {DialogWindowContext} from '../dialogWindowContext'

export const TextDialog = ()=>{
  const {dialog, hide} = useContext(DialogWindowContext)
  const [data, setData] = useState("")

  const ok = ()=>{
    console.log(typeof(dialog.action),data);
    if(typeof(dialog.action)==="function")
      dialog.action(data)
    hide()
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{dialog.title}</div>
      <div className="dialogBody">
        <p>{dialog.text}</p>
        <div className="input-data">
          <input required type = "text" name = "input" value={data} onChange={(e)=>{setData(e.target.value)}}/>
          <label>{dialog.placeholder}</label>
        </div>
      </div>
      <div className="dialogFooter">
      <button className="dialogButton button normalSelection" onClick={ok}>ok</button>
      <button className="dialogButton button normalSelection" onClick={hide}>cancel</button>
      </div>
    </div>
    </>
  )
}
