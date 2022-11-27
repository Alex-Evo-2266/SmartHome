import React from 'react'

export const BaseCard = ({children, className, onClick})=>{

  const click = (e)=>{
    if(typeof(onClick)==="function")
      onClick(e)
  }
  
  return(
    <div onClick={click} className={`base-card-container card-container ${className}`}>
    	{children}
    </div>
  )
}
