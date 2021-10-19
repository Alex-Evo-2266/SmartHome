import React from 'react'

export const ContextMenu = ({buttons=[], className, style, hide}) =>{

  if(buttons?.length === 0){
    return null
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div onClick={hide} style={style} className={`contextmenu show ${className}`}>
      {
        buttons.map((item, index)=>{
          if (item.type === "dividers")
            return(
              <div key={index} className="dividers"></div>
            )
          return(
            <div key={index} className="contextmenuElement" onClick={item.onClick}>
              <span className="state">{(item.active)?<i className="fas fa-check"></i>:null}</span>
              <span className="content">{item.title}</span>
            </div>
          )
        })
      }
    </div>
    </>
  )
}
