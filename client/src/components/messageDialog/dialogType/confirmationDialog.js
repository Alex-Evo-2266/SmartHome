import React, {useState} from 'react'

export const ConfirmationDialog = ({title, hide, active, items, buttons, activeText})=>{
  const [data, setData] = useState("")

  const out = ()=>{
    if(typeof(active)==="function")
      active(data)
  }

  return(
    <>
    <div className="dialogCoteiner card-container">
      <div className="card-head">{title}</div>
      <div className="dividers"></div>
      <div className="card-content scroll">
        {items?.map((item, index)=>{
          return(
            <label key={index} className="dialogItem">
              <input type="radio" name="data" value={item.data} checked={data===item.data} onChange={()=>setData(item.data)}/>
              <p>{item.title}</p>
            </label>
          )
        })}
      </div>
      <div className="dividers"></div>
      <div className="card-btn-container">
      {
        buttons?.map((item, index)=>{
          return(
            <button key={index} className="btn" onClick={item.action}>{item.title}</button>
          )
        })
      }
      {
        (!buttons)?
        <button className="btn" onClick={hide}>CANCEL</button>
        :null
      }
        <button className="btn" onClick={out} disabled={data===""}>{activeText||"OK"}</button>
      </div>
    </div>
    </>
  )
}
