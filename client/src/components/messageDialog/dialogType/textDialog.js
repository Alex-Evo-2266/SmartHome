import React, {useState} from 'react'

export const TextDialog = ({hide, title, text, active, placeholder})=>{
  const [data, setData] = useState("")

  const ok = ()=>{
    if(typeof(active)==="function")
      active(data)
    hide()
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{title}</div>
      <div className="dialogBody">
        <p>{text}</p>
        <div className="input-data">
          <input required type = "text" name = "input" value={data} onChange={(e)=>{setData(e.target.value)}}/>
          <label>{placeholder}</label>
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
