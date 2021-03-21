import React from 'react'

export const MenuComponent = ({name, icon,url,use=false,onClick,def=false}) =>{

  return(
    <div className="menu-component-paragraph">
      <div className="icon">
        <i className={icon}></i>
      </div>
      <p>{name}</p>
      <div className="menu-component-btn" >
        {
          (!def&&use)?<i className="fas fa-times-circle" style={{color:"#f00"}} onClick={()=>onClick(name,icon,url)}></i>
          :(!def&&!use)?<i className="fas fa-plus-circle" style={{color:"#0f0"}} onClick={()=>onClick(name,icon,url)}></i>:
          null
        }
      </div>
    </div>
  )
}
