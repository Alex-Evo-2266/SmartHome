import React from 'react'

export const StyleIcon = ({colors}) =>{

  return(
    <div className="styleIcon">
      <div className="styleIcon-color" style={{background:colors.c1}}></div>
      <div className="styleIcon-color" style={{background:colors.c2}}></div>
      <div className="styleIcon-color" style={{background:colors.active}}></div>
    </div>
  )
}
