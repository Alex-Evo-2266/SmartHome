import React, {useState} from 'react'

export const ConfirmationDialog = ({title, hide, active, items, buttons, activeText})=>{
  const [data, setData] = useState("")

  const out = ()=>{
    if(typeof(active)==="function")
      active(data)
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{title}</div>
      <div className="dividers"></div>
      <div className="dialogBody scroll">
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
      <div className="dialogFooter">
      {
        buttons?.map((item, index)=>{
          return(
            <button key={index} className="dialogButton button normalSelection" onClick={item.action}>{item.title}</button>
          )
        })
      }
      {
        (!buttons)?
        <button className="dialogButton button normalSelection" onClick={hide}>CANCEL</button>
        :null
      }
        <button className="dialogButton button normalSelection" onClick={out} disabled={data===""}>{activeText||"OK"}</button>
      </div>
    </div>
    </>
  )
}
