import React from 'react'

export const BaseCard = ({user,updata, children})=>{

  return(
    <div className="base-card-container card-container">
    	{children}
    </div>
  )
}
