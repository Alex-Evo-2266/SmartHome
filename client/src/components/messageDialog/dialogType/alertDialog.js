import React from 'react'

export const AlertDialog = ({hide, text, title, buttons})=>{

  return(
    <>
    <div className="dialogCoteiner">
      <div className="dialogHeader">{title}</div>
      <div className="dialogBody">
        <p>{text}</p>
      </div>
      <div className="dialogFooter" onClick={hide}>
      {
        buttons?.map((item, index)=>{
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
