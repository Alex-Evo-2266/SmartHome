import React,{useState} from 'react'
import {ContextMenu} from '../contextMenu/contextMenu'

export const Menu = ({buttons=[], className}) =>{
  const [visible, setVisible] = useState(false)

  if(buttons?.length === 0){
    return null
  }

  return(
    <>
    <div className="menuTogleBtn" onClick={()=>setVisible(!visible)}>
      <i className="fas fa-ellipsis-v"></i>
    </div>
    {
      (visible)?
      <ContextMenu hide={()=>setVisible(false)} buttons={buttons} className={className}/>
      :null
    }
    </>
  )
}
