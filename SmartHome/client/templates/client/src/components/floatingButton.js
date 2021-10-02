import React from 'react'

export const FloatingButton = ({type, action, big, title}) =>{
  return(
    <div className={`specialActionButton ${(big)?"big":""}`} onClick={action}>
    {
      (type==="config")?
      <i className="fas fa-cog"></i>:
      (type==="ok")?
      <i className="fas fa-check"></i>:
      (type==="close")?
      <i className="fas fa-times"></i>:
      <i className="fas fa-plus"></i>
    }
    <span>{title}</span>
    </div>
)
}
