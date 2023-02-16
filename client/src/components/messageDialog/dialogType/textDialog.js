import React, {useEffect, useState} from 'react'

export const TextDialog = ({hide, title, text, active, placeholder, defText=null})=>{
  const [data, setData] = useState("")

  useEffect(() => {
    if (defText)
      setData(defText)
  }, [defText]);

  const ok = ()=>{
    if(typeof(active)==="function")
      active(data)
    hide()
  }

  return(
    <>
    <div className="dialogCoteiner card-container">
      <div className="card-head">{title}</div>
      <div className="card-content">
        <p>{text}</p>
        <br/>
        <div className="input-data">
          <input required type = "text" name = "input" value={data} onChange={(e)=>{setData(e.target.value)}}/>
          <label>{placeholder}</label>
        </div>
      </div>
      <div className="card-btn-container">
      <button className="btn" onClick={ok}>ok</button>
      <button className="btn" onClick={hide}>cancel</button>
      </div>
    </div>
    </>
  )
}
