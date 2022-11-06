import React from 'react'

export const CastomDialog = ({title, hide, html, buttons})=>{

  return(
    <>
    <div className="dialogCoteiner card-container">
      <div className="card-head">{title}</div>
      {html}
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
        <button className="btn" onClick={hide}>Exit</button>
        :null
      }
      </div>
    </div>
    </>
  )
}
