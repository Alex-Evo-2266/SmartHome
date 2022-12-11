import React,{useState} from 'react'
import { ContextMenu } from './contextMenu'

export const DopMenu = ({buttons=[], className, style={}}) =>{
  const [visible, setVisible] = useState(false)

  if(buttons?.length === 0){
    return null
  }

  return(
    <div className='context-menu-container' style={style}>
    <div className="menuTogleBtn" onClick={()=>setVisible(!visible)}>
      <i className="fas fa-ellipsis-v"></i>
    </div>
    {
      (visible)?
      <ContextMenu hide={()=>setVisible(false)} buttons={buttons} className={className}/>
      :null
    }
    </div>
  )
}
