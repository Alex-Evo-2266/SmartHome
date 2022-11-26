import React from 'react'

export const BaseCard = ({children, className})=>{

  return(
    <div className={`base-card-container card-container ${className}`}>
    	{children}
    </div>
  )
}
