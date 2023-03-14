import React from 'react'

export const AlertDialog = ({hide, text, title, buttons})=>{

  return(
    <>
    <div className="dialogCoteiner card-container">
      <div className="card-head">{title}</div>
      <div className="card-content">
        <p>{text}</p>
      </div>
      <div className="card-btn-container" onClick={hide}>
      {
        buttons?.map((item, index)=>{
          return(
            <button key={index} className="dialogButton btn" onClick={item.action}>{item.title}</button>
          )
        })
      }
      </div>
    </div>
    </>
  )
}
