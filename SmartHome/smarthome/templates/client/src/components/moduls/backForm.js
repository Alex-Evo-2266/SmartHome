import React from 'react'

export const BackForm = ({children,onClick})=>{

  const click = (event) =>{
    if(event.target.className === "backForm"&&typeof(onClick)==="function")
      onClick(event);
  }

  return(
    <div className = "backForm" onClick = {click}>
      {children}
    </div>
  )
}
