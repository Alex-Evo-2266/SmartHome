import React from 'react'

export const ScriptDeviceTrigger = ({text, del}) => {

  const deleteBtn = ()=>{
    if (typeof(del) === "function")
      del()
  }

  return(
    <div className='tab-list-item'>
        <div className='tab-list-item-content'>{text}</div>
        <div className='tab-list-item-del' onClick={deleteBtn}>x</div>
    </div>
  )
}
