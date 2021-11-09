import React from 'react'
import {ContextMenuElement} from './contextMenuElement'

export const ContextMenu = ({buttons=[], className, style, hide}) =>{

  if(buttons?.length === 0){
    return null
  }

  return(
    <>
    <div className="backGlass" onClick={hide}></div>
    <div style={style} className={`contextmenu show ${className}`}>
      {
        buttons.map((item, index)=>{
          if (item.type === "dividers")
            return(
              <div key={index} className="dividers"></div>
            )
          return(
            <ContextMenuElement key={index} item={item} hide={hide}/>
          )
        })
      }
    </div>
    </>
  )
}
